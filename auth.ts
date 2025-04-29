import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { authConfig } from './auth.config';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import connectMongoose from '@/lib/mongoose-connect';

declare module 'next-auth' {
    interface User {
        role?: 'instructor' | 'student';
        image?: string | null;
        email?: string | null;
    }

    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string;
            image?: string | null;
            role: 'instructor' | 'student';
            emailVerified?: Date | null;
        };
    }
}

declare module '@auth/core/jwt' {
    interface JWT {
        id: string;
        role: 'instructor' | 'student';
        image?: string | null;
        email: string;
        emailVerified?: Date | null;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                const email = (credentials.email as string).toLowerCase();
                const password = credentials.password as string;

                await connectMongoose();
                const user = await User.findOne({ email: email });

                if (!user) {
                    throw new Error('No user found with this email');
                }

                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                    throw new Error('Invalid password');
                }

                if (!user.role || !['instructor', 'student'].includes(user.role)) {
                    throw new Error('User account is missing a valid role. Please contact support.');
                }

                return { id: user._id.toString(), name: user.name, email: user.email, role: user.role, image: user.image };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google' && user.email) {
                await connectMongoose();
                const email = user.email.toLowerCase();
                let existingUser = await User.findOne({ email });

                if (existingUser) {
                    const client = await clientPromise;
                    const db = client.db();
                    const existingAccount = await db.collection('accounts').findOne({
                        provider: 'google',
                        providerAccountId: account.providerAccountId,
                    });

                    if (!existingAccount) {
                        await db.collection('accounts').insertOne({
                            provider: 'google',
                            providerAccountId: account.providerAccountId,
                            userId: existingUser._id,
                            access_token: account.access_token,
                            expires_at: account.expires_at,
                            scope: account.scope,
                            token_type: account.token_type,
                            id_token: account.id_token,
                        });
                    }
                    if (!existingUser.role || !['instructor', 'student'].includes(existingUser.role)) {
                        throw new Error('User account is missing a valid role. Please contact support.');
                    }
                } else {
                    const callbackUrl = account.callbackUrl;
                    const role =
                        (typeof callbackUrl === 'string' &&
                            new URLSearchParams(callbackUrl.split('?')[1]).get('role')) ||
                        'student';
                    if (!['instructor', 'student'].includes(role)) {
                        throw new Error('Invalid role specified');
                    }
                    existingUser = await User.create({
                        name: user.name,
                        email: email,
                        image: user.image,
                        role,
                        createdAt: new Date(),
                    });

                    const client = await clientPromise;
                    const db = client.db();
                    await db.collection('accounts').insertOne({
                        provider: 'google',
                        providerAccountId: account.providerAccountId,
                        userId: existingUser._id,
                        access_token: account.access_token,
                        expires_at: account.expires_at,
                        scope: account.scope,
                        token_type: account.token_type,
                        id_token: account.id_token,
                    });
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id!;
                token.email = user.email!;
                token.role = user.role!;
                token.image = user.image;
                token.emailVerified = null;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && token.id) {
                session.user = {
                    id: token.id,
                    name: token.name || null,
                    email: token.email,
                    role: token.role,
                    image: token.image || null,
                    emailVerified: token.emailVerified || null,
                };
            }
            return session;
        },
    },
});