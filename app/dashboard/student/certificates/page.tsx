import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import connectMongoose from '@/lib/mongoose-connect';
import User from '@/models/User';
import Course from '@/models/Course';
import UserProgress from '@/models/UserProgress';
import Question from '@/models/Question';
import mongoose from 'mongoose';
import CertificatesClient from './CertificatesClient';
import { Metadata } from 'next';

interface Instructor {
  _id: string;
  name: string;
}

interface Chapter {
  _id: string;
  title: string;
  position: number;
  isPublished: boolean;
}

interface Quiz {
  _id: string;
  isRequiredForCompletion: boolean;
}

interface Course {
  _id: mongoose.Types.ObjectId;
  title: string;
  chapters: Chapter[];
  quizzes: Quiz[];
  userId: Instructor;
}

interface User {
  _id: mongoose.Types.ObjectId;
  name: string;
  enrolledCourses: Course[];
  role: string;
}

interface QuizResult {
  questionId: mongoose.Types.ObjectId;
  isCorrect: boolean;
}

interface UserProgress {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  completedChapters: mongoose.Types.ObjectId[];
  quizResults: QuizResult[];
  updatedAt: Date;
}

interface Question {
  _id: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
}

interface CertificateData {
  courseId: string;
  courseTitle: string;
  instructorName: string;
  completionDate: string;
}

export const metadata: Metadata = {
  title: 'Dashboard - My Certificates',
  description: 'View all your earned certificates',
};

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'student') {
    redirect('/dashboard');
  }

  await connectMongoose();

  try {
    await User.find().limit(0).exec();
    await Course.find().limit(0).exec();
    await UserProgress.find().limit(0).exec();
    await Question.find().limit(0).exec();
  } catch (error) {
    console.error('Error registering models:', error);
  }

  // Fetch user and enrolled courses
  const user = await User.findById(session.user.id).populate<{
    enrolledCourses: Course[];
  }>({
    path: 'enrolledCourses',
    populate: [
      {
        path: 'chapters',
        match: { isPublished: true },
        select: 'title position',
      },
      {
        path: 'quizzes',
        select: 'isRequiredForCompletion',
      },
      {
        path: 'userId',
        select: 'name',
      },
    ],
  }).lean<User>();

  if (!user) {
    return <div>Error: User not found</div>;
  }

  const enrolledCourses = user.enrolledCourses || [];

  // Fetch progress for all enrolled courses
  const courseIds = enrolledCourses.map((course) => course._id);
  const userProgresses = await UserProgress.find({
    userId: user._id,
    courseId: { $in: courseIds },
  }).lean<UserProgress[]>();

  // Fetch questions for quizzes
  const quizIds = enrolledCourses.flatMap((course) =>
    (course.quizzes || []).map((quiz) => quiz._id)
  );
  const questions = await Question.find({ quizId: { $in: quizIds } })
    .select('quizId')
    .lean<Question[]>();

  const certificates: CertificateData[] = enrolledCourses
    .map((course: Course): CertificateData | null => {
      const progress = userProgresses.find(
        (p) => p.courseId.toString() === course._id.toString()
      );
      if (!progress) return null;

      // Calculate progress
      const completedChapterIds = progress.completedChapters.map((id) => id.toString());
      const requiredQuizzes = (course.quizzes || []).filter(
        (q) => q.isRequiredForCompletion
      );
      const requiredQuestionIds = questions
        .filter((q) =>
          requiredQuizzes.some((quiz) => quiz._id.toString() === q.quizId.toString())
        )
        .map((q) => q._id.toString());
      const completedQuestions = progress.quizResults
        .filter(
          (r) => r.isCorrect && requiredQuestionIds.includes(r.questionId.toString())
        )
        .map((r) => r.questionId.toString());
      const totalItems = (course.chapters || []).length + requiredQuestionIds.length;
      const completedItems = completedChapterIds.length + completedQuestions.length;
      const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

      if (progressPercentage < 100) return null;

      const completionDate = new Date(progress.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      return {
        courseId: course._id.toString(),
        courseTitle: course.title,
        instructorName: course.userId?.name || 'Instructor Name',
        completionDate,
      };
    })
    .filter((cert): cert is CertificateData => cert !== null);

  return (
    <CertificatesClient
      certificates={certificates}
      user={{ name: user.name, id: user._id.toString() }}
    />
  );
}