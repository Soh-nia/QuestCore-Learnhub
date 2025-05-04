import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import connectMongoose from '@/lib/mongoose-connect';
import Course from '@/models/Course';
import User from '@/models/User';
import UserProgress from '@/models/UserProgress';
import Question from '@/models/Question';
import mongoose from 'mongoose';
import CertificateClient from './CertificateClient';

// Define interfaces for Mongoose models and populated fields
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

interface Instructor {
  _id: string;
  name: string;
}

interface CourseDocument {
  _id: string;
  title: string;
  userId: Instructor;
  chapters: Chapter[];
  quizzes: Quiz[];
  __v?: number;
}

interface QuestionDocument {
  _id: string;
  quizId: string;
}

interface QuizResult {
  questionId: string;
  isCorrect: boolean;
}

interface UserProgressDocument {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  completedChapters: mongoose.Types.ObjectId[];
  quizResults: QuizResult[];
}

export default async function CertificatePage({ params }: { params: Promise<{ courseId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'student') {
    redirect('/dashboard');
  }

  await connectMongoose();

  // Fetch user and verify enrollment
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return <div>Error: User not found</div>;
  }

  const resolvedParams = await params;
  const courseId = resolvedParams.courseId;
  if (!user.enrolledCourses.some((id: mongoose.Types.ObjectId) => id.toString() === courseId)) {
    redirect('/dashboard/student/courses');
  }

  // Fetch course with instructor details
  const course = await Course.findById(courseId)
    .populate<{ chapters: Chapter[] }>({
      path: 'chapters',
      match: { isPublished: true },
      select: 'title position',
    })
    .populate<{ quizzes: Quiz[] }>({
      path: 'quizzes',
      select: 'isRequiredForCompletion',
    })
    .populate<{ userId: Instructor }>({
      path: 'userId',
      select: 'name',
    })
    .lean<CourseDocument>();

  if (!course) {
    return <div>Error: Course not found</div>;
  }

  // Fetch user progress
  const userProgress = await UserProgress.findOne({ userId: user._id, courseId }).lean<UserProgressDocument>();
  if (!userProgress) {
    redirect(`/dashboard/student/courses/${courseId}`);
  }

  // Verify completion
  const completedChapterIds = userProgress.completedChapters.map((id: mongoose.Types.ObjectId) => id.toString());
  const quizIds = (course.quizzes || []).map((quiz) => quiz._id);
  const questions = await Question.find({ quizId: { $in: quizIds } })
    .select('quizId')
    .lean<QuestionDocument[]>();
  const requiredQuizzes = (course.quizzes || []).filter((q) => q.isRequiredForCompletion);
  const requiredQuestionIds = questions
    .filter((q) => requiredQuizzes.some((quiz) => quiz._id.toString() === q.quizId.toString()))
    .map((q) => q._id.toString());
  const completedQuestions = userProgress.quizResults
    .filter((r) => r.isCorrect && requiredQuestionIds.includes(r.questionId.toString()))
    .map((r) => r.questionId.toString());
  const totalItems = (course.chapters || []).length + requiredQuestionIds.length;
  const completedItems = completedChapterIds.length + completedQuestions.length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  // Extract instructor name
  const instructorName = course.userId?.name || 'Instructor Name';

  // Pass props to client component
  return (
    <CertificateClient
      user={{ name: user.name, id: user._id.toString() }}
      course={{ title: course.title, id: courseId }}
      instructorName={instructorName}
      progressPercentage={progressPercentage}
    />
  );
}