import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import QuizForm from './QuizForm';
import { Metadata } from 'next';
import mongoose from 'mongoose';
import connectMongoose from '@/lib/mongoose-connect';
import Course from '@/models/Course';
import User from '@/models/User';
import { QuizI } from '@/types/course';

// Type for populated quiz document
interface QuizDocument {
  _id: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  title: string;
  isRequiredForCompletion: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const metadata: Metadata = {
  title: 'Manage Quiz',
  description: 'Create or edit a quiz for your course',
};

export default async function QuizManagePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'instructor') {
    redirect('/auth/signin');
  }

  await connectMongoose();

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    redirect('/auth/signin');
  }

  // Await params to resolve the promise
  const { courseId } = await params;

  const course = await Course.findOne({
    _id: courseId,
    userId: user._id,
  }).populate('quizzes');
  if (!course) {
    redirect('/dashboard/instructor/courses');
  }

  const quizzes: QuizI[] = (course.quizzes || []).map((quiz: QuizDocument) => ({
    _id: quiz._id.toString(),
    courseId: quiz.courseId.toString(),
    title: quiz.title,
    isRequiredForCompletion: quiz.isRequiredForCompletion,
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt,
  }));

  return (
    <div className="flex flex-col min-h-screen px-2 sm:px-4 py-10 mx-auto max-w-7xl">
      <QuizForm courseId={courseId} quizzes={quizzes} />
    </div>
  );
}