import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import connectMongoose from '@/lib/mongoose-connect';
import User from '@/models/User';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import Course from '@/models/Course';
import UserProgress from '@/models/UserProgress';
import Question from '@/models/Question';
import mongoose from 'mongoose';
import { FaCheckCircle } from 'react-icons/fa';
import Quiz from '@/models/Quiz';

// Define TypeScript interfaces for the data models
interface Chapter {
  _id: mongoose.Types.ObjectId;
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
  description?: string;
  imageUrl?: string;
  chapters: Chapter[];
  quizzes: Quiz[];
}

interface QuizResult {
  questionId: mongoose.Types.ObjectId;
  isCorrect: boolean;
}

interface UserProgressType {
  courseId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  completedChapters: mongoose.Types.ObjectId[];
  quizResults: QuizResult[];
}

interface QuestionType {
  _id: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
}

interface CourseProgress {
  courseId: string;
  progressPercentage: number;
  isCompleted: boolean;
}

interface User {
  _id: mongoose.Types.ObjectId;
  enrolledCourses: Course[];
}

export const metadata: Metadata = {
  title: 'Dashboard - Enrolled Course List',
  description: 'View all your courses',
};

export default async function StudentDashboard() {
  const session = await auth();
  if (!session || session.user.role !== 'student') {
    redirect('/auth/signin');
  }

  await connectMongoose();

  try {
    await Course.find().limit(0).exec();
    await User.find().limit(0).exec();
    await UserProgress.find().limit(0).exec();
    await Question.find().limit(0).exec();
    await Quiz.find().limit(0).exec();
    await Question.find().limit(0).exec();
  } catch (error) {
    console.error('Error registering models:', error);
  }

  const user: User | null = await User.findById(session.user.id).populate({
    path: 'enrolledCourses',
    populate: [
      { 
        path: 'chapters', 
        match: { isPublished: true }, 
        select: 'title position' 
      },
      { 
        path: 'quizzes', 
        select: 'isRequiredForCompletion' 
      }
    ]
  });

  if (!user) {
    return <div>Error: User not found</div>;
  }

  const enrolledCourses: Course[] = user.enrolledCourses || [];

  // Fetch progress and quiz questions for all courses
  const courseIds = enrolledCourses.map((course: Course) => course._id);
  const userProgresses = await UserProgress.find({
    userId: user._id,
    courseId: { $in: courseIds }
  }).lean().exec() as unknown as UserProgressType[];

  const quizIds = enrolledCourses.flatMap((course: Course) =>
    (course.quizzes || []).map((quiz: Quiz) => quiz._id)
  );
  const questions = await Question.find({ quizId: { $in: quizIds } })
    .select('quizId')
    .lean()
    .exec() as unknown as QuestionType[];

  // Calculate progress for each course
  const courseProgress: CourseProgress[] = enrolledCourses.map((course: Course) => {
    const progress: UserProgressType = userProgresses.find(
      (p: UserProgressType) => p.courseId.toString() === course._id.toString()
    ) || { 
      courseId: course._id, 
      userId: user._id, 
      completedChapters: [], 
      quizResults: [] 
    };

    const completedChapterIds = progress.completedChapters.map(
      (id: mongoose.Types.ObjectId) => id.toString()
    );
    const requiredQuizzes: Quiz[] = (course.quizzes || []).filter(
      (q: Quiz) => q.isRequiredForCompletion
    );
    const requiredQuestionIds = questions
      .filter((q: QuestionType) =>
        requiredQuizzes.some((quiz: Quiz) => quiz._id.toString() === q.quizId.toString())
      )
      .map((q: QuestionType) => q._id.toString());
    const completedQuestions = progress.quizResults
      .filter((r: QuizResult) =>
        r.isCorrect && requiredQuestionIds.includes(r.questionId.toString())
      )
      .map((r: QuizResult) => r.questionId.toString());

    const totalItems = (course.chapters || []).length + requiredQuestionIds.length;
    const completedItems = completedChapterIds.length + completedQuestions.length;
    const progressPercentage = totalItems > 0 ? Math.min((completedItems / totalItems) * 100, 100) : 0;

    return {
      courseId: course._id.toString(),
      progressPercentage,
      isCompleted: progressPercentage >= 100,
    };
  });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-10">
          My Courses
        </h1>
        {enrolledCourses.length === 0 ? (
          <div className="text-center bg-white dark:bg-neutral-800 rounded-xl shadow-lg py-16 px-6">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              No Courses Enrolled
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start your learning journey by exploring available courses!
            </p>
            <Link
              href="/courses"
              className="inline-block px-6 py-2.5 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors duration-200"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course: Course) => {
              const progress: CourseProgress | undefined = courseProgress.find(
                (p: CourseProgress) => p.courseId === course._id.toString()
              );
              return (
                <div
                  key={course._id.toString()}
                  className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-48">
                    <Image
                      src={course.imageUrl || 'https://images.unsplash.com/photo-1633114128174-2f8aa49759b0'}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    {progress?.isCompleted && (
                      <div className="absolute top-3 right-3 bg-lime-600 text-white rounded-full p-1.5">
                        <FaCheckCircle className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {course.description || 'No description available.'}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-3">
                      <p>{(course.chapters || []).length} Chapters</p>
                      <p>{(course.quizzes || []).length} Quizzes</p>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          Progress
                        </span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {progress?.progressPercentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2.5">
                        <div
                          className="bg-lime-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${progress?.progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/dashboard/student/courses/${course._id.toString()}`}
                        className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors duration-200 text-sm font-medium"
                      >
                        {progress?.progressPercentage === 0 ? 'Start Course' : 'Continue Learning'}
                      </Link>
                      {progress?.isCompleted && (
                        <Link
                          href={`/dashboard/student/courses/${course._id.toString()}/certificate`}
                          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-200 text-sm font-medium"
                        >
                          Download Certificate
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}