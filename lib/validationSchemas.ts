import { z } from 'zod';
import mongoose from 'mongoose';

export const userSchema = z
    .object({
        name: z
            .string()
            .min(1, 'Name is required.')
            .max(255, 'Name must be 255 characters or less.'),
        email: z
            .string()
            .min(1, 'Email is required.')
            .email('Invalid email format.')
            .max(254, 'Email must be 254 characters or less.'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters.')
            .max(255, 'Password must be 255 characters or less.')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                'Password must contain at least one lowercase letter, one uppercase letter, and one number.'
            ),
        confirmPassword: z
            .string()
            .min(1, 'Please confirm your password.'),
        role: z.enum(['instructor', 'student']),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
    });

export const CourseSchema = z.object({
    title: z
        .string()
        .min(3, { message: 'Title must be at least 3 characters long' })
        .max(100, { message: 'Title cannot exceed 100 characters' })
        .trim()
        .optional()
        .nullable(),
    description: z
        .string()
        .min(10, { message: 'Description must be at least 10 characters long' })
        .max(1000, { message: 'Description cannot exceed 1000 characters' })
        .trim()
        .optional()
        .nullable(),
    imageUrl: z
        .string()
        .url({ message: 'Image URL must be a valid URL' })
        .max(1000, { message: 'Image URL cannot exceed 1000 characters' })
        .optional()
        .nullable(),
    categoryId: z
        .string()
        .refine((val) => !val || mongoose.Types.ObjectId.isValid(val), {
            message: 'Invalid category ID',
        })
        .optional()
        .nullable(),
    price: z
        .number()
        .min(0, { message: 'Price cannot be negative' })
        .optional()
        .nullable(),
    isPublished: z
        .boolean()
        .optional(),
});

export const CreateCourseSchema = z.object({
    title: z
        .string()
        .min(3, { message: 'Title must be at least 3 characters long' })
        .max(100, { message: 'Title cannot exceed 100 characters' })
        .trim(),
});

export const AttachmentSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Attachment name is required' })
        .max(100, { message: 'Attachment name cannot exceed 100 characters' })
        .trim(),
    url: z
        .string()
        .url({ message: 'Attachment URL must be a valid URL' })
        .max(1000, { message: 'Attachment URL cannot exceed 1000 characters' }),
    courseId: z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: 'Invalid course ID',
        }),
});

// Schema for creating a chapter
export const CreateChapterSchema = z.object({
    title: z
        .string()
        .min(3, { message: 'Title must be at least 3 characters long' })
        .max(100, { message: 'Title cannot exceed 100 characters' })
        .trim(),
    courseId: z
        .string()
        .refine((id) => mongoose.Types.ObjectId.isValid(id), {
            message: 'Invalid course ID',
        }),
});

// Schema for updating chapter positions
export const UpdateChapterPositionsSchema = z.array(
    z.object({
        id: z
            .string()
            .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                message: 'Invalid chapter ID',
            }),
        position: z.number().int().min(0),
    })
);

// Schema for updating a chapter
export const UpdateChapterSchema = z.object({
    title: z
        .string()
        .min(3, { message: 'Title must be at least 3 characters long' })
        .max(100, { message: 'Title cannot exceed 100 characters' })
        .trim()
        .nullable()
        .optional(),
    description: z
        .string()
        .max(5000, { message: 'Description cannot exceed 5000 characters' })
        .nullable()
        .optional(),
    isFree: z
        .boolean()
        .optional(),
    videoUrl: z
        .string()
        .url({ message: 'Video URL must be a valid URL' })
        .nullable()
        .optional(),
    isPublished: z
        .boolean()
        .optional(),
    courseId: z
        .string()
        .refine((id) => mongoose.Types.ObjectId.isValid(id), {
            message: 'Invalid course ID',
        }),
    chapterId: z
        .string()
        .refine((id) => mongoose.Types.ObjectId.isValid(id), {
            message: 'Invalid chapter ID',
        }),
});

export const CategorySchema = z.object({
    name: z
        .string()
        .min(3, { message: 'Category name must be at least 3 characters long' })
        .max(50, { message: 'Category name cannot exceed 50 characters' })
        .trim(),
});

// Zod schema for quiz creation
export const CreateQuizSchema = z.object({
    courseId: z.string().min(1, 'Course ID is required'),
    title: z.string().min(1, 'Quiz title is required'),
    isRequiredForCompletion: z.boolean().default(false),
    questions: z
        .array(
            z
                .object({
                    text: z.string().min(1, 'Question text is required'),
                    options: z
                        .array(z.string().min(1, 'Option cannot be empty'))
                        .min(2, 'At least two options are required')
                        .max(4, 'Maximum four options allowed'),
                    correctAnswer: z
                        .number()
                        .int()
                        .min(0, 'Correct answer index must be at least 0'),
                })
                .refine(
                    (data) => data.correctAnswer < data.options.length,
                    {
                        message: 'Correct answer index must be valid',
                        path: ['correctAnswer'],
                    }
                )
        )
        .min(1, 'At least one question is required'),
});