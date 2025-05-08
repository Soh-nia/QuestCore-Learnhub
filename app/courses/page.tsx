import connectMongoose from '@/lib/mongoose-connect';
import Course from '@/models/Course';
import Category from '@/models/Category';
import User from '@/models/User';
import Chapter from '@/models/Chapter';
import CoursesClient from './CoursesClient';
import Header from '@/app/_components/Header';
import Footer from '@/app/_components/Footer';
import { Metadata } from 'next';
import { RawCourseHome, RawCategory } from '@/types/course';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { auth } from '@/auth';
import mongoose from 'mongoose';

interface Category {
  _id: string;
  name: string;
}

interface UserLean {
  _id: string;
  enrolledCourses: mongoose.Types.ObjectId[];
}

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Explore Courses',
  description: 'Explore all our courses',
};

export default async function CoursesPage() {
  const session = await auth();
  await connectMongoose();

  try {
    await Chapter.find().limit(0).exec();
    await User.find().limit(0).exec();
  } catch (error) {
    console.error('Error registering models:', error);
  }

  // Fetch enrolled courses if the user is a student
  let enrolledCourses: string[] = [];
  if (session?.user?.role === 'student') {
    try {
      const user = await User.findOne({ email: session.user.email })
        .select('enrolledCourses')
        .lean() as UserLean | null;
      if (user) {
        enrolledCourses = user.enrolledCourses.map((id: mongoose.Types.ObjectId) => id.toString());
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  }

  // Fetch all categories
  const rawCategories = await Category.find({})
    .sort({ name: 1 })
    .lean() as RawCategory[];

  const categories: Category[] = rawCategories.map((cat) => ({
    _id: cat._id.toString(),
    name: cat.name,
  }));

  // Fetch all published courses
  const rawCourses = await Course.find({ isPublished: true })
    .populate('userId', 'name image')
    .populate({
      path: 'chapters',
      match: { isPublished: true },
    })
    .populate('categoryId', 'name')
    .lean() as RawCourseHome[];

  const courses = rawCourses.map((course) => ({
    _id: course._id.toString(),
    title: course.title,
    description: course.description || null,
    imageUrl: course.imageUrl || 'https://images.unsplash.com/photo-1633114128174-2f8aa49759b0',
    price: course.price ?? null,
    categoryId: course.categoryId?._id?.toString() || '',
    categoryName: course.categoryId?.name || 'Uncategorized',
    chapterCount: course.chapters?.length || 0,
    instructorName: course.userId?.name || 'Unknown Instructor',
    instructorImage: course.userId?.image || '/default.png',  }));

  return (
    <main id="content" className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto w-full">
      <Suspense
          fallback={
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-lime-600" />
            </div>
          }
        >
          <CoursesClient categories={categories} initialCourses={courses} enrolledCourses={enrolledCourses} />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}