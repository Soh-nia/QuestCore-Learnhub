import { NextResponse } from 'next/server';
import connectMongoose from '@/lib/mongoose-connect';
import Course from '@/models/Course';
import Category from '@/models/Category';
import User from '@/models/User';
import Chapter from '@/models/Chapter';
import { RawCourseHome, RawCategory } from '@/types/course';


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    if (!categoryId) {
        return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    await connectMongoose();

    try {
        await Chapter.find().limit(0).exec();
        await User.find().limit(0).exec();
    } catch (error) {
        console.error('Error registering models:', error);
    }

    const category = await Category.findById(categoryId).lean() as RawCategory | null;
    if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    try {
        const courses = await Course.find({
            categoryId,
            isPublished: true,
        })
            .populate({
                path: 'userId',
                model: 'User',
                select: 'name image',
            })
            .populate('chapters')
            .lean() as RawCourseHome[];

        const totalCourses = courses.length;

        const serializedCourses = courses.map((course) => ({
            _id: course._id.toString(),
            title: course.title,
            description: course.description || null,
            imageUrl: course.imageUrl || 'https://images.unsplash.com/photo-1633114128174-2f8aa49759b0',
            price: course.price ?? null,
            categoryName: category.name,
            chapterCount: course.chapters?.length || 0,
            instructorName: course.userId?.name || 'Unknown Instructor',
            instructorImage: course.userId?.image || '/default.jpg',
        }));

        return NextResponse.json({ courses: serializedCourses, totalCourses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
    }
}