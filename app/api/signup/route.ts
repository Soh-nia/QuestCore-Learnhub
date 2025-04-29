import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import connectMongoose from '@/lib/mongoose-connect';
import mongoose from 'mongoose';
import User from '@/models/User';
import { userSchema } from '@/lib/validationSchemas';

export async function POST(req: NextRequest) {
    try {
        // Connect to MongoDB
        await connectMongoose();

        // Parse and validate request body
        const body = await req.json();
        const parsedData = userSchema.parse(body);

        const { name, email, password, role } = parsedData;
        const normalizedEmail = email.toLowerCase();

        // Check if user exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role,
            createdAt: new Date(),
        });
        await user.save();

        return NextResponse.json({ message: 'User created', id: user._id }, { status: 201 });
    } catch (error) {
        console.error('Sign-up error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        if (error instanceof mongoose.Error) {
            return NextResponse.json({ error: 'Database error occurred' }, { status: 500 });
        }
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}