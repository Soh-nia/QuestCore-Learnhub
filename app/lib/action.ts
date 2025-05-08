'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { unstable_cache } from "next/cache"
import { auth } from '@/auth';
import {
    CourseSchema,
    CreateCourseSchema,
    AttachmentSchema,
    CreateChapterSchema,
    UpdateChapterPositionsSchema,
    UpdateChapterSchema,
    CategorySchema,
    CreateQuizSchema
} from '@/lib/validationSchemas';
import mongoose from 'mongoose';
import connectMongoose from '@/lib/mongoose-connect';
import Course from '@/models/Course';
import User from '@/models/User';
import Category from '@/models/Category';
import Attachment from '@/models/Attachment';
import Chapter from '@/models/Chapter';
import Quiz from '@/models/Quiz';
import Question from '@/models/Question';
import { CourseI, RawCourse } from '@/types/course';
import { z } from 'zod';

interface CourseQuery {
    userId: mongoose.Types.ObjectId;
    title?: { $regex: string; $options: string };
}

export type State = {
    errors?: {
        [key: string]: string[] | undefined;
    };
    message?: string | null;
    submittedData?: Record<string, boolean | undefined>;
    courses?: CourseI[];
    totalCourses?: number;
    page?: number;
    pageSize?: number;
};

export async function invalidateCoursesCache() {
    revalidatePath("/dashboard/instructor/courses")
}

export const fetchInstructorCoursesWithCache = unstable_cache(
    async ({
        userId,
        search = "",
        page = 1,
        pageSize = 10,
    }: {
        userId: string
        search?: string
        page?: number
        pageSize?: number
    }): Promise<State> => {
        try {
            await connectMongoose()

            // Convert string userId to ObjectId
            const userObjectId = new mongoose.Types.ObjectId(userId)

            // Build query
            const query: CourseQuery = { userId: userObjectId }
            if (search) {
                query.title = { $regex: search, $options: "i" }
            }

            // Get total count for pagination
            const totalCourses = await Course.countDocuments(query)

            const courses = (await Course.find(query)
                .populate("categoryId")
                .populate("quizzes")
                .populate("attachments")
                .populate("chapters")
                .sort({ createdAt: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .lean()
                .exec()) as unknown as RawCourse[]

            // Transform to CourseI format
            const formattedCourses: CourseI[] = courses.map((course) => ({
                _id: course._id.toString(),
                userId: course.userId.toString(),
                title: course.title,
                description: course.description || null,
                imageUrl: course.imageUrl,
                price: course.price || null,
                isPublished: course.isPublished,
                categoryId: course.categoryId ? course.categoryId.toString() : null,
                categoryName: course.categoryId?.name || null,
                quizzes: Array.isArray(course.quizzes)
                    ? course.quizzes.map((quiz) => ({
                        _id: quiz._id.toString(),
                        courseId: quiz.courseId.toString(),
                        title: quiz.title,
                        isRequiredForCompletion: quiz.isRequiredForCompletion,
                        createdAt: quiz.createdAt,
                        updatedAt: quiz.updatedAt,
                    }))
                    : [],
                attachments: Array.isArray(course.attachments)
                    ? course.attachments.map((attachment) => ({
                        _id: attachment._id.toString(),
                        name: attachment.name,
                        url: attachment.url,
                        courseId: attachment.courseId.toString(),
                        createdAt: attachment.createdAt,
                        updatedAt: attachment.updatedAt,
                    }))
                    : [],
                chapters: Array.isArray(course.chapters)
                    ? course.chapters.map((chapter) => ({
                        _id: chapter._id.toString(),
                        title: chapter.title,
                        description: chapter.description || null,
                        videoUrl: chapter.videoUrl || null,
                        position: chapter.position,
                        isPublished: chapter.isPublished,
                        isFree: chapter.isFree,
                        courseId: chapter.courseId.toString(),
                        createdAt: chapter.createdAt,
                        updatedAt: chapter.updatedAt,
                    }))
                    : [],
                createdAt: course.createdAt,
                updatedAt: course.updatedAt,
            }))

            return {
                message: "Courses fetched successfully.",
                errors: {},
                courses: formattedCourses,
                totalCourses,
                page,
                pageSize,
            }
        } catch (error) {
            console.error("fetchInstructorCourses error:", error)
            return {
                message: "Failed to fetch courses.",
                errors: { server: ["Internal server error"] },
            }
        }
    },
    ["instructor-courses"],
    {
        revalidate: 60 * 5,
        tags: ["instructor-courses"],
    },
)

export async function createCourse(prevState: State, formData: FormData): Promise<State> {
    const session = await auth();
    if (!session?.user) {
        redirect('/auth/signin');
    }

    if (session.user.role !== 'instructor') {
        return {
            message: 'Unauthorized: Only instructors can create courses.',
        };
    }

    const validatedFields = CreateCourseSchema.safeParse({
        title: formData.get('title'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid input. Please check the form fields.',
        };
    }

    const { title } = validatedFields.data;

    let newCourse;
    try {
        await connectMongoose();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return {
                message: 'User not found in database.',
            };
        }

        newCourse = await Course.create({
            userId: user._id,
            title,
            isPublished: false,
        });

        // Invalidate the courses cache after creating a new course
        await invalidateCoursesCache()
    } catch (error) {
        console.error('Error creating course:', error);
        if (error instanceof mongoose.Error) {
            return {
                message: `Database Error: ${error.message}`,
            };
        }
        return {
            message: 'Failed to create course. Please try again.',
        };
    }

    redirect(`/dashboard/instructor/courses/${newCourse._id}?success=true`);
    return { message: 'Course Created Successfully.' };
}

export async function updateCourse(prevState: State, formData: FormData): Promise<State> {
    const session = await auth();
    if (!session?.user) {
        redirect('/auth/signin');
    }

    if (session.user.role !== 'instructor') {
        return {
            message: 'Unauthorized: Only instructors can edit courses.',
        };
    }

    const validatedFields = CourseSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        imageUrl: formData.get('imageUrl'),
        categoryId: formData.get('categoryId'),
        price: formData.get('price') ? Number(formData.get('price')) : undefined,
        isPublished: formData.get('isPublished') ? formData.get('isPublished') === 'true' : undefined,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid input. Please check the form fields.',
        };
    }

    const { title, description, imageUrl, categoryId, price, isPublished } = validatedFields.data;

    const courseId = formData.get('courseId');

    if (!courseId) {
        return { message: 'Course ID is required.' };
    }

    const updateFields: {
        title?: string;
        description?: string;
        imageUrl?: string;
        categoryId?: string | null;
        price?: number | null;
        isPublished?: boolean;
    } = {};
    if (title != null) updateFields.title = title;
    if (description != null) updateFields.description = description;
    if (imageUrl != null) updateFields.imageUrl = imageUrl;
    if (categoryId != null) updateFields.categoryId = categoryId === '' ? null : categoryId;
    if (price != null) updateFields.price = price;
    if (isPublished != null) updateFields.isPublished = isPublished;

    if (Object.keys(updateFields).length === 0) {
        return { message: 'No fields provided to update.' };
    }

    try {
        await connectMongoose();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return {
                message: 'User not found in database.',
            };
        }

        const course = await Course.findOne({ _id: courseId, userId: user._id });
        if (!course) {
            return { message: 'Course not found or you do not have permission to update it.' };
        }

        // Validate categoryId exists if provided
        if (categoryId && categoryId !== '') {
            const category = await Category.findById(categoryId);
            if (!category) {
                return { message: 'Selected category does not exist.' };
            }
        }

        // If the course is published, validate all required fields post-update
        if (course.isPublished) {
            const updatedFields = {
                title: title != null ? title : course.title,
                description: description != null ? description : course.description,
                imageUrl: imageUrl != null ? imageUrl : course.imageUrl,
                categoryId: categoryId != null ? (categoryId === '' ? null : categoryId) : course.categoryId,
                price: price != null ? price : course.price,
            };

            const publishedChaptersCount = await Chapter.countDocuments({
                courseId,
                isPublished: true,
            });

            const requiredFields = [
                updatedFields.title,
                updatedFields.description,
                updatedFields.imageUrl,
                updatedFields.categoryId,
                updatedFields.price != null, // price must be a number (not null)
                publishedChaptersCount > 0,
            ];

            const isComplete = requiredFields.every(Boolean);

            console.log(`updateCourse: Validating published course ${courseId}, required fields complete: ${isComplete}, published chapters: ${publishedChaptersCount}`);

            if (!isComplete && isPublished !== false) {
                console.log(`updateCourse: Unpublishing course ${courseId} due to incomplete required fields`);
                updateFields.isPublished = false;
            }
        }

        // If trying to publish the course, ensure at least one chapter is published
        if (isPublished === true) {
            const publishedChaptersCount = await Chapter.countDocuments({
                courseId,
                isPublished: true,
            });
            console.log(`updateCourse: Attempting to publish course ${courseId}, published chapters: ${publishedChaptersCount}`);
            if (publishedChaptersCount === 0) {
                return {
                    message: 'Cannot publish course: At least one chapter must be published.',
                };
            }
        }

        await Course.findByIdAndUpdate(courseId, updateFields, { new: true });

        await invalidateCoursesCache()
        revalidatePath(`/dashboard/instructor/courses/${courseId}`);

        return { message: 'Course updated successfully.', errors: {} };
    } catch (error) {
        console.error('Error updating course:', error);
        if (error instanceof mongoose.Error) {
            return {
                message: `Database Error: ${error.message}`,
            };
        }
        return {
            message: 'Failed to update course. Please try again.',
        };
    }
}

export async function deleteCourse(prevState: State, formData: FormData): Promise<State> {
    const session = await auth();
    if (!session?.user) {
        redirect('/auth/signin');
    }

    if (session.user.role !== 'instructor') {
        return {
            message: 'Unauthorized: Only instructors can delete courses.',
        };
    }

    const courseId = formData.get('courseId');

    if (!courseId) {
        return { message: 'Course ID is required.' };
    }

    if (typeof courseId !== 'string') {
        return { message: 'Invalid course ID format.' };
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return { message: 'Invalid course ID.' };
    }

    try {
        await connectMongoose();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return {
                message: 'User not found in database.',
            };
        }

        const course = await Course.findOne({ _id: courseId, userId: user._id });
        if (!course) {
            return { message: 'Course not found or you do not have permission to delete it.' };
        }

        // Delete associated chapters
        await Chapter.deleteMany({ courseId });

        // Delete associated attachments
        await Attachment.deleteMany({ courseId });

        // Delete the course
        await Course.findByIdAndDelete(courseId);

        await invalidateCoursesCache()

        return { message: 'Course deleted successfully.', errors: {} };
    } catch (error) {
        console.error('Error deleting course:', error);
        if (error instanceof mongoose.Error) {
            return {
                message: `Database Error: ${error.message}`,
            };
        }
        return {
            message: 'Failed to delete course. Please try again.',
        };
    }
}

export async function addAttachment(prevState: State, formData: FormData): Promise<State> {
    const session = await auth();
    if (!session?.user) {
        redirect('/auth/signin');
    }

    if (session.user.role !== 'instructor') {
        return {
            message: 'Unauthorized: Only instructors can add attachments.',
        };
    }

    const validatedFields = AttachmentSchema.safeParse({
        name: formData.get('name'),
        url: formData.get('url'),
        courseId: formData.get('courseId'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid input. Please check the form fields.',
        };
    }

    const { name, url, courseId } = validatedFields.data;

    try {
        await connectMongoose();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return {
                message: 'User not found in database.',
            };
        }

        const course = await Course.findOne({ _id: courseId, userId: user._id });
        if (!course) {
            return { message: 'Course not found or you do not have permission to update it.' };
        }

        const attachment = await Attachment.create({
            name,
            url,
            courseId,
        });

        await Course.findByIdAndUpdate(courseId, {
            $push: { attachments: attachment._id },
        });

        revalidatePath('/dashboard/instructor/courses');
        revalidatePath(`/dashboard/instructor/courses/${courseId}`);

        return { message: 'Attachment added successfully.', errors: {} };
    } catch (error) {
        console.error('Error adding attachment:', error);
        if (error instanceof mongoose.Error) {
            return {
                message: `Database Error: ${error.message}`,
            };
        }
        return {
            message: 'Failed to add attachment. Please try again.',
        };
    }
}

export async function deleteAttachment(prevState: State, formData: FormData): Promise<State> {
    const session = await auth();
    if (!session?.user) {
        redirect('/auth/signin');
    }

    if (session.user.role !== 'instructor') {
        return {
            message: 'Unauthorized: Only instructors can delete attachments.',
        };
    }

    const attachmentId = formData.get('attachmentId');
    const courseId = formData.get('courseId');

    if (!attachmentId || !courseId) {
        return { message: 'Attachment ID and Course ID are required.' };
    }

    if (typeof attachmentId !== 'string' || typeof courseId !== 'string') {
        return { message: 'Invalid attachment or course ID format.' };
    }

    if (!mongoose.Types.ObjectId.isValid(attachmentId) || !mongoose.Types.ObjectId.isValid(courseId)) {
        return { message: 'Invalid attachment or course ID.' };
    }

    try {
        await connectMongoose();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return {
                message: 'User not found in database.',
            };
        }

        const course = await Course.findOne({ _id: courseId, userId: user._id });
        if (!course) {
            return { message: 'Course not found or you do not have permission to update it.' };
        }

        const attachment = await Attachment.findById(attachmentId);
        if (!attachment || attachment.courseId.toString() !== courseId) {
            return { message: 'Attachment not found or does not belong to this course.' };
        }

        await Attachment.findByIdAndDelete(attachmentId);
        await Course.findByIdAndUpdate(courseId, {
            $pull: { attachments: attachmentId },
        });

        revalidatePath('/dashboard/instructor/courses');
        revalidatePath(`/dashboard/instructor/courses/${courseId}`);

        return { message: 'Attachment deleted successfully.', errors: {} };
    } catch (error) {
        console.error('Error deleting attachment:', error);
        if (error instanceof mongoose.Error) {
            return {
                message: `Database Error: ${error.message}`,
            };
        }
        return {
            message: 'Failed to delete attachment. Please try again.',
        };
    }
}

export async function createChapter(prevState: State, formData: FormData): Promise<State> {
    const session = await auth();
    if (!session?.user) {
        redirect('/auth/signin');
    }

    if (session.user.role !== 'instructor') {
        return {
            message: 'Unauthorized: Only instructors can create chapters.',
        };
    }

    const validatedFields = CreateChapterSchema.safeParse({
        title: formData.get('title'),
        courseId: formData.get('courseId'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid input. Please check the form fields.',
        };
    }

    const { title, courseId } = validatedFields.data;

    let chapter;
    try {
        await connectMongoose();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return {
                message: 'User not found in database.',
            };
        }

        const course = await Course.findOne({ _id: courseId, userId: user._id });
        if (!course) {
            return {
                message: 'Course not found or you do not have permission to update it.',
            };
        }

        // Set position to the end of existing chapters
        const position = course.chapters.length;

        chapter = await Chapter.create({
            title,
            courseId,
            position,
            isPublished: false,
            isFree: false,
        });

        await Course.findByIdAndUpdate(courseId, {
            $push: { chapters: chapter._id },
        });

        revalidatePath('/dashboard/instructor/courses');
        revalidatePath(`/dashboard/instructor/courses/${courseId}`);
    } catch (error) {
        console.error('Error creating chapter:', error);
        if (error instanceof mongoose.Error) {
            return {
                message: `Database Error: ${error.message}`,
            };
        }
        return {
            message: 'Failed to create chapter. Please try again.',
        };
    }
    redirect(`/dashboard/instructor/courses/${courseId}/chapters/${chapter._id}`);
}

export async function updateChapterPositions(
    prevState: State,
    formData: FormData
): Promise<State> {
    const session = await auth();
    if (!session?.user) {
        redirect('/auth/signin');
    }

    if (session.user.role !== 'instructor') {
        return {
            message: 'Unauthorized: Only instructors can reorder chapters.',
        };
    }

    const courseId = formData.get('courseId');
    const positions = JSON.parse(formData.get('positions') as string);

    const validatedFields = UpdateChapterPositionsSchema.safeParse(positions);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid input. Please try again.',
        };
    }

    if (!courseId || typeof courseId !== 'string' || !mongoose.Types.ObjectId.isValid(courseId)) {
        return { message: 'Invalid course ID.' };
    }

    const updateData = validatedFields.data;

    try {
        await connectMongoose();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return {
                message: 'User not found in database.',
            };
        }

        const course = await Course.findOne({ _id: courseId, userId: user._id });
        if (!course) {
            return {
                message: 'Course not found or you do not have permission to update it.',
            };
        }

        // Verify all chapters belong to the course
        const chapterIds = updateData.map((item) => item.id);
        const chapters = await Chapter.find({ _id: { $in: chapterIds }, courseId });
        if (chapters.length !== updateData.length) {
            return {
                message: 'Some chapters are invalid or do not belong to this course.',
            };
        }

        // Update positions
        await Promise.all(
            updateData.map(({ id, position }) =>
                Chapter.findByIdAndUpdate(id, { position }, { new: true })
            )
        );

        revalidatePath('/dashboard/instructor/courses');
        revalidatePath(`/dashboard/instructor/courses/${courseId}`);

        return { message: 'Chapter positions updated successfully.', errors: {} };
    } catch (error) {
        console.error('Error updating chapter positions:', error);
        if (error instanceof mongoose.Error) {
            return {
                message: `Database Error: ${error.message}`,
            };
        }
        return {
            message: 'Failed to update chapter positions. Please try again.',
        };
    }
}

export async function invalidateChapterCache(courseId: string, chapterId: string) {
    revalidatePath(`/dashboard/instructor/courses/${courseId}/chapters/${chapterId}`)
    revalidatePath(`/dashboard/instructor/courses/${courseId}`)
}

export async function updateChapter(prevState: State, formData: FormData): Promise<State> {
    const session = await auth();
    if (!session?.user) {
        redirect('/auth/signin');
    }

    if (session.user.role !== 'instructor') {
        return {
            message: 'Unauthorized: Only instructors can update chapters.',
        };
    }

    const validatedFields = UpdateChapterSchema.safeParse({
        title: formData.get('title') || undefined,
        description: formData.get('description') || undefined,
        isFree: formData.get('isFree') ? formData.get('isFree') === 'true' : undefined,
        videoUrl: formData.get('videoUrl') || undefined,
        isPublished: formData.get('isPublished') ? formData.get('isPublished') === 'true' : undefined,
        courseId: formData.get('courseId'),
        chapterId: formData.get('chapterId'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid input. Please check the form fields.',
        };
    }

    const { title, description, isFree, videoUrl, isPublished, courseId, chapterId } = validatedFields.data;

    const updateFields: { title?: string; description?: string | null; isFree?: boolean; videoUrl?: string | null; isPublished?: boolean } = {};
    if (title != null) updateFields.title = title;
    if (description != null) updateFields.description = description;
    if (isFree != null) updateFields.isFree = isFree;
    if (videoUrl != null) updateFields.videoUrl = videoUrl;
    if (isPublished != null) updateFields.isPublished = isPublished;

    if (Object.keys(updateFields).length === 0) {
        return { message: 'No fields provided to update.' };
    }

    try {
        await connectMongoose();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return {
                message: 'User not found in database.',
            };
        }

        const course = await Course.findOne({ _id: courseId, userId: user._id });
        if (!course) {
            return {
                message: 'Course not found or you do not have permission to update it.',
            };
        }

        const chapter = await Chapter.findOne({ _id: chapterId, courseId });
        if (!chapter) {
            return {
                message: 'Chapter not found or does not belong to this course.',
            };
        }

        // Check if the chapter is being unpublished
        if (isPublished === false && chapter.isPublished) {
            const publishedChaptersCount = await Chapter.countDocuments({
                courseId,
                isPublished: true,
                _id: { $ne: chapterId },
            });

            if (publishedChaptersCount === 0 && course.isPublished) {
                await Course.findByIdAndUpdate(courseId, { isPublished: false }, { new: true });
            }
        }

        await Chapter.findByIdAndUpdate(chapterId, updateFields, { new: true });

        revalidatePath('/dashboard/instructor/courses');
        await invalidateChapterCache(courseId, chapterId)

        return {
            message: 'Chapter updated successfully.',
            errors: {},
            submittedData: { isFree, isPublished },
        };
    } catch (error) {
        console.error('Error updating chapter:', error);
        if (error instanceof mongoose.Error) {
            return {
                message: `Database Error: ${error.message}`,
            };
        }
        return {
            message: 'Failed to update chapter. Please try again.',
        };
    }
}

export async function deleteChapter(prevState: State, formData: FormData): Promise<State> {
    const session = await auth();
    if (!session?.user) {
        redirect('/auth/signin');
    }

    if (session.user.role !== 'instructor') {
        return {
            message: 'Unauthorized: Only instructors can delete chapters.',
        };
    }

    const courseId = formData.get('courseId');
    const chapterId = formData.get('chapterId');

    if (!courseId || !chapterId) {
        return { message: 'Course ID and Chapter ID are required.' };
    }

    if (typeof courseId !== 'string' || typeof chapterId !== 'string') {
        return { message: 'Invalid course or chapter ID format.' };
    }

    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(chapterId)) {
        return { message: 'Invalid course or chapter ID.' };
    }

    try {
        await connectMongoose();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return {
                message: 'User not found in database.',
            };
        }

        const course = await Course.findOne({ _id: courseId, userId: user._id });
        if (!course) {
            return { message: 'Course not found or you do not have permission to delete it.' };
        }

        const chapter = await Chapter.findOne({ _id: chapterId, courseId });
        if (!chapter) {
            return { message: 'Chapter not found or does not belong to this course.' };
        }

        const isChapterPublished = chapter.isPublished;

        await Chapter.findByIdAndDelete(chapterId);
        await Course.findByIdAndUpdate(courseId, {
            $pull: { chapters: chapterId },
        });

        if (isChapterPublished) {
            const remainingPublishedChapters = await Chapter.countDocuments({
                courseId,
                isPublished: true,
            });

            if (remainingPublishedChapters === 0 && course.isPublished) {
                await Course.findByIdAndUpdate(courseId, { isPublished: false }, { new: true });
            }
        }

        revalidatePath('/dashboard/instructor/courses');
        revalidatePath(`/dashboard/instructor/courses/${courseId}`);

        return { message: 'Chapter deleted successfully.', errors: {} };
    } catch (error) {
        console.error('Error deleting chapter:', error);
        if (error instanceof mongoose.Error) {
            return {
                message: `Database Error: ${error.message}`,
            };
        }
        return {
            message: 'Failed to delete chapter. Please try again.',
        };
    }
}

export async function createCategory(_prevState: State, formData: FormData): Promise<State> {
    const validatedFields = CategorySchema.safeParse({
        name: formData.get('name'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid fields. Failed to create category.',
        };
    }

    const { name } = validatedFields.data;

    try {
        await connectMongoose();

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return { message: 'Category already exists.' };
        }

        await Category.create({ name });
        return { message: 'Category created successfully.' };
    } catch (error) {
        console.error('Error creating category:', error);
        return { message: 'Database error: Failed to create category.' };
    }
}

export async function createQuiz(formData: FormData): Promise<State> {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'instructor') {
            return {
                message: 'Unauthorized: Please sign in as an instructor.',
                errors: { auth: ['User not authenticated or not an instructor'] },
            };
        }

        await connectMongoose();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return {
                message: 'User not found in database.',
                errors: { user: ['User not found'] },
            };
        }

        // Parse and validate form data
        const rawData = {
            courseId: formData.get('courseId') as string,
            title: formData.get('title') as string,
            isRequiredForCompletion: formData.get('isRequiredForCompletion') === 'true',
            questions: JSON.parse(formData.get('questions') as string),
        };

        const validatedData = CreateQuizSchema.safeParse(rawData);
        if (!validatedData.success) {
            return {
                message: 'Validation failed.',
                errors: validatedData.error.flatten().fieldErrors,
            };
        }

        const { courseId, title, isRequiredForCompletion, questions } = validatedData.data;

        // Verify course exists and belongs to user
        const course = await Course.findOne({ _id: courseId, userId: user._id });
        if (!course) {
            return {
                message: 'Course not found or you do not have permission.',
                errors: { course: ['Invalid course ID or unauthorized'] },
            };
        }

        // Create quiz
        const quiz = new Quiz({
            courseId,
            title,
            isRequiredForCompletion,
        });
        await quiz.save();

        // Create questions
        const questionDocs = questions.map((q) => ({
            quizId: quiz._id,
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
        }));
        await Question.insertMany(questionDocs);

        // Add quiz to course
        course.quizzes.push(quiz._id);
        await course.save();

        revalidatePath(`/dashboard/instructor/courses/${courseId}`);
        return {
            message: 'Quiz created successfully.',
            errors: {},
        };
    } catch (error) {
        console.error('createQuiz error:', error);
        return {
            message: 'Failed to create quiz.',
            errors: { server: ['Internal server error'] },
        };
    }
}

export async function updateQuiz(formData: FormData): Promise<State> {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'instructor') {
            return {
                message: 'Unauthorized: Please sign in as an instructor.',
                errors: { auth: ['User not authenticated or not an instructor'] },
            };
        }

        await connectMongoose();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return {
                message: 'User not found in database.',
                errors: { user: ['User not found'] },
            };
        }

        // Parse and validate form data
        const rawData = {
            quizId: formData.get('quizId') as string,
            courseId: formData.get('courseId') as string,
            title: formData.get('title') as string,
            isRequiredForCompletion: formData.get('isRequiredForCompletion') === 'true',
            questions: JSON.parse(formData.get('questions') as string),
        };

        const validatedData = CreateQuizSchema.extend({
            quizId: z.string().min(1, 'Quiz ID is required'),
        }).safeParse(rawData);
        if (!validatedData.success) {
            return {
                message: 'Validation failed.',
                errors: validatedData.error.flatten().fieldErrors,
            };
        }

        const { quizId, courseId, title, isRequiredForCompletion, questions } = validatedData.data;

        // Verify course and quiz exist and belong to user
        const course = await Course.findOne({ _id: courseId, userId: user._id });
        if (!course) {
            return {
                message: 'Course not found or you do not have permission.',
                errors: { course: ['Invalid course ID or unauthorized'] },
            };
        }

        const quiz = await Quiz.findOne({ _id: quizId, courseId });
        if (!quiz) {
            return {
                message: 'Quiz not found.',
                errors: { quiz: ['Invalid quiz ID'] },
            };
        }

        // Update quiz
        quiz.title = title;
        quiz.isRequiredForCompletion = isRequiredForCompletion;
        await quiz.save();

        // Delete existing questions
        await Question.deleteMany({ quizId });

        // Create new questions
        const questionDocs = questions.map((q) => ({
            quizId: quiz._id,
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
        }));
        await Question.insertMany(questionDocs);

        revalidatePath(`/dashboard/instructor/courses/${courseId}`);
        return {
            message: 'Quiz updated successfully.',
            errors: {},
        };
    } catch (error) {
        console.error('updateQuiz error:', error);
        return {
            message: 'Failed to update quiz.',
            errors: { server: ['Internal server error'] },
        };
    }
}