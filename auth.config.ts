import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

            if (isOnDashboard && !isLoggedIn) {
                const signInUrl = new URL('/auth/signin', nextUrl);
                signInUrl.searchParams.set('callbackUrl', nextUrl.toString());
                return Response.redirect(signInUrl);
            }

            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;