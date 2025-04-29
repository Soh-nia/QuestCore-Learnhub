import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectMongoose from '@/lib/mongoose-connect';
import Category from '@/models/Category';

const CategorySchema = z.object({
    name: z
        .string()
        .min(3, { message: 'Category name must be at least 3 characters long' })
        .max(50, { message: 'Category name cannot exceed 50 characters' })
        .trim(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedFields = CategorySchema.safeParse(body);

        if (!validatedFields.success) {
            return NextResponse.json(
                {
                    errors: validatedFields.error.flatten().fieldErrors,
                    message: 'Invalid fields. Failed to create category.',
                },
                { status: 400 }
            );
        }

        const { name } = validatedFields.data;

        await connectMongoose();

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return NextResponse.json(
                { message: 'Category already exists.' },
                { status: 400 }
            );
        }

        const category = await Category.create({ name });
        return NextResponse.json(
            { message: 'Category created successfully.', category },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating category:', error);
        // if (error.code === 11000) {
        //   return NextResponse.json(
        //     { message: 'Category already exists.' },
        //     { status: 400 }
        //   );
        // }
        return NextResponse.json(
            { message: 'Database error: Failed to create category.' },
            { status: 500 }
        );
    }
}