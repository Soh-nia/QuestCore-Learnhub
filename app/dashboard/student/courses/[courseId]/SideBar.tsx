'use client';

import { Dispatch, SetStateAction, useTransition } from 'react';
import { ServerAction } from './page';
import { MdOutlineQuiz } from 'react-icons/md';

interface Chapter {
  _id: string;
  title: string;
  description: string;
  position: number;
}

interface Quiz {
  _id: string;
  title: string;
  isRequiredForCompletion: boolean;
  questions: {
    _id: string;
    text: string;
    options: string[];
    correctAnswer: number;
  }[];
}

interface SidebarProps {
  chapters: Chapter[];
  quizzes: Quiz[];
  completedChapterIds: string[];
  quizResults: { questionId: string; isCorrect: boolean }[];
  markChapterComplete: ServerAction;
  selectedItem: { type: 'chapter' | 'quiz'; id: string };
  setSelectedItem: Dispatch<SetStateAction<{ type: 'chapter' | 'quiz'; id: string }>>;
}

export default function Sidebar({
  chapters,
  quizzes,
  completedChapterIds,
  quizResults,
  markChapterComplete,
  selectedItem,
  setSelectedItem,
}: SidebarProps) {
  const [isPending, startTransition] = useTransition();

  // Check if a quiz is completed (all questions answered correctly)
  const isQuizCompleted = (quiz: Quiz) => {
    const questionIds = quiz.questions.map((q) => q._id);
    return questionIds.length > 0
      ? questionIds.every((qId) =>
          quizResults.some((r) => r.questionId === qId && r.isCorrect)
        )
      : false;
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6 h-[calc(100vh-200px)] overflow-y-auto">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Course Content</h2>
      <div className="space-y-2">
        {chapters.map((chapter) => (
          <div
            key={chapter._id}
            className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${
              selectedItem.type === 'chapter' && selectedItem.id === chapter._id
                ? 'bg-lime-100 dark:bg-lime-900'
                : 'bg-gray-50 dark:bg-neutral-700'
            }`}
            onClick={() => setSelectedItem({ type: 'chapter', id: chapter._id })}
          >
            <div className="flex items-center space-x-1">
              <span className="text-gray-900 dark:text-white">{chapter.title}</span>
            </div>
            <form
              action={() =>
                startTransition(() => {
                  markChapterComplete(chapter._id);
                })
              }
            >
              <button
                type="submit"
                disabled={completedChapterIds.includes(chapter._id) || isPending}
                className={`text-lime-600 disabled:text-gray-400 text-sm ${
                  isPending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isPending
                  ? 'Marking...'
                  : completedChapterIds.includes(chapter._id)
                  ? '✔'
                  : 'Mark Complete'}
              </button>
            </form>
          </div>
        ))}
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${
              selectedItem.type === 'quiz' && selectedItem.id === quiz._id
                ? 'bg-lime-100 dark:bg-lime-900'
                : 'bg-gray-50 dark:bg-neutral-700'
            }`}
            onClick={() => setSelectedItem({ type: 'quiz', id: quiz._id })}
          >
            <div className="flex items-center space-x-2">
              <span className="flex items-center text-gray-900 dark:text-white">
                <MdOutlineQuiz className="mr-1" />
                {quiz.title}
              </span>
              {quiz.isRequiredForCompletion && (
                <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-lime-100 text-lime-800 dark:bg-lime-800/30 dark:text-lime-500">Required</span>
              )}
            </div>
            {isQuizCompleted(quiz) && (
              <span className="text-lime-600 text-sm">✔</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}