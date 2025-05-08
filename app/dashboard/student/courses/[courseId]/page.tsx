import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import connectMongoose from '@/lib/mongoose-connect';
import Course from '@/models/Course';
import User from '@/models/User';
import Chapter from '@/models/Chapter';
import UserProgress from '@/models/UserProgress';
import Question from '@/models/Question';
import mongoose from 'mongoose';
import Link from 'next/link';
import { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import CourseContent from './CourseContent';
import Attachment from '@/models/Attachment';
import Quiz from '@/models/Quiz';

export const metadata: Metadata = {
  title: 'Dashboard - Course Content',
  description: 'Engage with your enrolled course content',
};

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ courseId: string }>;
}

export interface Chapter {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  position: number;
  isPublished: boolean;
  isFree: boolean;
}

export interface Quiz {
  _id: string;
  title: string;
  isRequiredForCompletion: boolean;
  questions: {
    _id: string;
    text: string;
    options: string[];
    correctAnswer: number;
  }[];
  createdAt: string;
}

export interface Attachment {
  _id: string;
  name: string;
  url: string;
}

export type ServerAction = (chapterId: string) => Promise<void>;
export type QuizSubmitAction = (questionId: string, selectedOption: number) => Promise<void>;
export type QuizAnswersSubmitAction = (
  answers: { questionId: string; selectedOption: number }[]
) => Promise<{ questionId: string; isCorrect: boolean }[]>;

interface LeanChapter {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  videoUrl?: string;
  position: number;
  isPublished: boolean;
  isFree: boolean;
}

interface LeanAttachment {
  _id: mongoose.Types.ObjectId;
  name: string;
  url: string;
}

interface LeanQuiz {
  _id: mongoose.Types.ObjectId;
  title: string;
  isRequiredForCompletion: boolean;
  createdAt: string;
}

interface LeanQuestion {
  _id: mongoose.Types.ObjectId;
  text: string;
  options: string[];
  correctAnswer: number;
  quizId: mongoose.Types.ObjectId;
}

interface LeanCourse {
  _id: mongoose.Types.ObjectId;
  title: string;
  chapters?: LeanChapter[];
  attachments?: LeanAttachment[];
  quizzes?: LeanQuiz[];
}

// interface LeanUserProgress {
//   userId: mongoose.Types.ObjectId;
//   courseId: mongoose.Types.ObjectId;
//   completedChapters: mongoose.Types.ObjectId[];
//   quizResults: { questionId: mongoose.Types.ObjectId; isCorrect: boolean }[];
//   createdAt: Date;
//   updatedAt: Date;
//   _id: mongoose.Types.ObjectId;
// }

export default async function CoursePage({ params }: Props) {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'student') {
    redirect('/dashboard');
  }

  await connectMongoose();

  try {
    await Chapter.find().limit(0).exec();
    await Attachment.find().limit(0).exec();
    await Quiz.find().limit(0).exec();
  } catch (error) {
    console.error('Error registering models:', error);
  }

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

  // Fetch course with populated published chapters, attachments, and quizzes
  const course = await Course.findById(courseId)
    .populate<{
      chapters: LeanChapter[];
      attachments: LeanAttachment[];
      quizzes: LeanQuiz[];
    }>({
      path: 'chapters',
      match: { isPublished: true },
      select: 'title description videoUrl position isPublished isFree',
    })
    .populate({
      path: 'attachments',
      select: 'name url',
    })
    .populate({
      path: 'quizzes',
      select: 'title isRequiredForCompletion createdAt',
    })
    .lean() as LeanCourse | null;

  if (!course) {
    return <div>Error: Course not found</div>;
  }

  // Fetch questions for all quizzes
  const quizIds = (course.quizzes || []).map((quiz) => quiz._id);
  const questions = await Question.find({ quizId: { $in: quizIds } })
    .select('text options correctAnswer quizId')
    .lean()
    .exec() as unknown as LeanQuestion[];

  // Fetch or initialize user progress
  let userProgress = await UserProgress.findOne({ userId: user._id, courseId });
  if (!userProgress) {
    userProgress = new UserProgress({ userId: user._id, courseId, completedChapters: [], quizResults: [] });
    await userProgress.save();
  }

  // Transform data
  const chapters: Chapter[] = (course.chapters || [])
    .map((chapter) => ({
      _id: chapter._id.toString(),
      title: chapter.title,
      description: chapter.description || '',
      videoUrl: chapter.videoUrl || '',
      position: chapter.position,
      isPublished: chapter.isPublished,
      isFree: chapter.isFree,
    }))
    .sort((a: Chapter, b: Chapter) => a.position - b.position);

  const attachments: Attachment[] = (course.attachments || []).map((attachment) => ({
    _id: attachment._id.toString(),
    name: attachment.name,
    url: attachment.url,
  }));

  const quizzes: Quiz[] = (course.quizzes || [])
    .map((quiz) => ({
      _id: quiz._id.toString(),
      title: quiz.title,
      isRequiredForCompletion: quiz.isRequiredForCompletion,
      questions: questions
        .filter((question) => question.quizId.toString() === quiz._id.toString())
        .map((question) => ({
          _id: question._id.toString(),
          text: question.text,
          options: question.options,
          correctAnswer: question.correctAnswer,
        })),
      createdAt: quiz.createdAt,
    }))
    .sort((a: Quiz, b: Quiz) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // Calculate progress
  const completedChapterIds: string[] = userProgress.completedChapters.map((id: mongoose.Types.ObjectId) =>
    id.toString()
  );
  const requiredQuizzes = quizzes.filter((q) => q.isRequiredForCompletion);
  const requiredQuestionIds = requiredQuizzes.flatMap((q) => q.questions.map((q) => q._id));
  const completedQuestions = userProgress.quizResults
    .filter((r: { questionId: mongoose.Types.ObjectId; isCorrect: boolean }) =>
      r.isCorrect && requiredQuestionIds.includes(r.questionId.toString())
    )
    .map((r: { questionId: mongoose.Types.ObjectId; isCorrect: boolean }) => r.questionId.toString());
  const totalItems = chapters.length + requiredQuestionIds.length;
  const completedItems = completedChapterIds.length + completedQuestions.length;
  const progressPercentage = totalItems > 0 ? Math.min((completedItems / totalItems) * 100, 100) : 0;

  // Extract quiz results
  const quizResults = userProgress.quizResults.map((result: { questionId: mongoose.Types.ObjectId; isCorrect: boolean }) => ({
    questionId: result.questionId.toString(),
    isCorrect: result.isCorrect,
  }));

  // Server action to mark chapter as complete
  async function markChapterComplete(chapterId: string) {
    'use server';
    await connectMongoose();
    try {
      await UserProgress.findOneAndUpdate(
        { userId: user._id, courseId },
        { $addToSet: { completedChapters: new mongoose.Types.ObjectId(chapterId) }, updatedAt: new Date() },
        { upsert: true }
      );
      revalidatePath(`/dashboard/student/courses/${courseId}`);
    } catch (error) {
      console.error('Error marking chapter complete:', error);
      throw new Error('Failed to mark chapter complete');
    }
  }

  // Server action to submit single quiz answer (kept for compatibility)
  async function submitQuizAnswer(questionId: string, selectedOption: number) {
    'use server';
    await connectMongoose();
    try {
      const question = await mongoose.model('Question').findById(questionId);
      if (!question) {
        throw new Error('Question not found');
      }
      const isCorrect = selectedOption === question.correctAnswer;
      await UserProgress.findOneAndUpdate(
        { userId: user._id, courseId },
        {
          $push: { quizResults: { questionId: new mongoose.Types.ObjectId(questionId), isCorrect } },
          updatedAt: new Date(),
        },
        { upsert: true }
      );
      revalidatePath(`/dashboard/student/courses/${courseId}`);
    } catch (error) {
      console.error('Error submitting quiz answer:', error);
      throw error;
    }
  }

  // Server action to submit multiple quiz answers
  async function submitQuizAnswers(answers: { questionId: string; selectedOption: number }[]) {
    'use server';
    await connectMongoose();
    try {
      const results: { questionId: string; isCorrect: boolean }[] = [];
      for (const { questionId, selectedOption } of answers) {
        const question = await mongoose.model('Question').findById(questionId);
        if (!question) {
          throw new Error(`Question ${questionId} not found`);
        }
        const isCorrect = selectedOption === question.correctAnswer;
        results.push({ questionId, isCorrect });
        // Update quiz results for all questions, but progress only counts required ones
        await UserProgress.findOneAndUpdate(
          { userId: user._id, courseId },
          {
            $push: { quizResults: { questionId: new mongoose.Types.ObjectId(questionId), isCorrect } },
            updatedAt: new Date(),
          },
          { upsert: true }
        );
      }
      revalidatePath(`/dashboard/student/courses/${courseId}`);
      return results;
    } catch (error) {
      console.error('Error submitting quiz answers:', error);
      throw error;
    }
  }

  // Default to first chapter or quiz
  const defaultSelectedId = chapters.length > 0 ? chapters[0]._id : quizzes.length > 0 ? quizzes[0]._id : '';
  const defaultSelectedType = chapters.length > 0 ? 'chapter' : quizzes.length > 0 ? 'quiz' : 'chapter';

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{course.title}</h1>
          <Link
            href="/dashboard/student/courses"
            className="px-3 py-2 bg-lime-600 text-white rounded hover:bg-lime-700"
          >
            Back to Courses
          </Link>
        </div>

        {progressPercentage >= 100 && (
          <div className="mb-8 p-6 bg-green-100 dark:bg-green-900 rounded-xl">
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-200">Course Completed!</h2>
            <p className="text-green-700 dark:text-green-300">
              Congratulations, you have completed the course! Download your certificate below.
            </p>
            <a
              href={`/dashboard/student/courses/${courseId}/certificate`}
              className="mt-4 inline-block px-4 py-2 bg-lime-600 text-white rounded hover:bg-lime-700"
            >
              Download Certificate
            </a>
          </div>
        )}

        <CourseContent
          chapters={chapters}
          quizzes={quizzes}
          attachments={attachments}
          completedChapterIds={completedChapterIds}
          progressPercentage={progressPercentage}
          quizResults={quizResults}
          defaultSelectedId={defaultSelectedId}
          defaultSelectedType={defaultSelectedType}
          courseId={courseId}
          userId={user._id.toString()}
          markChapterComplete={markChapterComplete}
          submitQuizAnswer={submitQuizAnswer}
          submitQuizAnswers={submitQuizAnswers}
        />
      </div>
    </main>
  );
}