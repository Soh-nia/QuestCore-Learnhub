import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import connectMongoose from '@/lib/mongoose-connect';
import User from '@/models/User';
import Course from '@/models/Course';
import UserProgress from '@/models/UserProgress';
import Question from '@/models/Question';
import Quiz from '@/models/Quiz';
import mongoose from 'mongoose';
import AnalyticsClient from './AnalyticsClient';
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
  _id: mongoose.Types.ObjectId;
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
  completionDate: string;
}

interface AnalyticsData {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  averageProgress: number;
  progressDistribution: { range: string; count: number }[];
  totalQuizzesAttempted: number;
  averageQuizScore: number;
  quizSuccessRate: number;
  totalCertificates: number;
  certificates: CertificateData[];
}

export const metadata: Metadata = {
  title: 'Dashboard - Student Analytics',
  description: 'View your learning analytics and progress',
};

export const dynamic = "force-dynamic";

export default async function StudentAnalyticsPage() {
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
    await Quiz.find().limit(0).exec();
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

  // Fetch progress and quiz data
  const courseIds = enrolledCourses.map((course) => course._id);
  const userProgresses = await UserProgress.find({
    userId: user._id,
    courseId: { $in: courseIds },
  }).lean<UserProgress[]>();

  const quizIds = enrolledCourses.flatMap((course) =>
    (course.quizzes || []).map((quiz) => quiz._id)
  );
  const questions = await Question.find({ quizId: { $in: quizIds } })
    .select('quizId')
    .lean<Question[]>();

  // Calculate analytics
  const totalCourses = enrolledCourses.length;
  let completedCourses = 0;
  let totalProgress = 0;
  const progressDistribution = [
    { range: '0-25%', count: 0 },
    { range: '26-50%', count: 0 },
    { range: '51-75%', count: 0 },
    { range: '76-100%', count: 0 },
  ];
  let totalQuizzesAttempted = 0;
  let totalCorrectAnswers = 0;
  let totalRequiredQuestions = 0;
  const certificates: CertificateData[] = [];

  enrolledCourses.forEach((course: Course) => {
    const progress = userProgresses.find(
      (p) => p.courseId.toString() === course._id.toString()
    ) || { completedChapters: [], quizResults: [], updatedAt: new Date() };

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
    const progressPercentage = totalItems > 0 ? Math.min((completedItems / totalItems) * 100, 100) : 0;

    // Update metrics
    totalProgress += progressPercentage;
    if (progressPercentage >= 100) {
      completedCourses++;
      certificates.push({
        courseId: course._id.toString(),
        courseTitle: course.title,
        completionDate: new Date(progress.updatedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      });
    }

    // Progress distribution
    if (progressPercentage <= 25) progressDistribution[0].count++;
    else if (progressPercentage <= 50) progressDistribution[1].count++;
    else if (progressPercentage <= 75) progressDistribution[2].count++;
    else progressDistribution[3].count++;

    // Quiz metrics
    totalQuizzesAttempted += (course.quizzes || []).filter((q) =>
      progress.quizResults.some((r) =>
        questions.some(
          (ques) =>
            ques.quizId.toString() === q._id.toString() &&
            r.questionId.toString() === ques._id.toString()
        )
      )
    ).length;
    totalCorrectAnswers += completedQuestions.length;
    totalRequiredQuestions += requiredQuestionIds.length;
  });

  const inProgressCourses = totalCourses - completedCourses;
  const averageProgress = totalCourses > 0 ? totalProgress / totalCourses : 0;
  const averageQuizScore = totalRequiredQuestions > 0 ? (totalCorrectAnswers / totalRequiredQuestions) * 100 : 0;
  const quizSuccessRate = totalRequiredQuestions > 0 ? (totalCorrectAnswers / totalRequiredQuestions) * 100 : 0;

  const analyticsData: AnalyticsData = {
    totalCourses,
    completedCourses,
    inProgressCourses,
    averageProgress,
    progressDistribution,
    totalQuizzesAttempted,
    averageQuizScore,
    quizSuccessRate,
    totalCertificates: certificates.length,
    certificates,
  };

  return (
    <AnalyticsClient
      analyticsData={analyticsData}
      user={{ name: user.name, id: user._id.toString() }}
    />
  );
}