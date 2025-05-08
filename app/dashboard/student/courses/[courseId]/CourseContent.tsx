'use client';

import { useState, useEffect } from 'react';
import Sidebar from './SideBar';
import QuizSection from './QuizSection';
import Confetti from '@/app/_components/Confetti';
import { Chapter, Quiz, Attachment, ServerAction, QuizSubmitAction, QuizAnswersSubmitAction } from './page';
import toast from 'react-hot-toast';

interface CourseContentProps {
  chapters: Chapter[];
  quizzes: Quiz[];
  attachments: Attachment[];
  completedChapterIds: string[];
  progressPercentage: number;
  quizResults: { questionId: string; isCorrect: boolean }[];
  defaultSelectedId: string;
  defaultSelectedType: 'chapter' | 'quiz';
  courseId: string;
  userId: string;
  markChapterComplete: ServerAction;
  submitQuizAnswer: QuizSubmitAction;
  submitQuizAnswers: QuizAnswersSubmitAction;
}

export default function CourseContent({
  chapters,
  quizzes,
  attachments,
  completedChapterIds: initialCompletedChapterIds,
  progressPercentage: initialProgressPercentage,
  quizResults,
  defaultSelectedId,
  defaultSelectedType,
  courseId,
  userId,
  markChapterComplete,
  submitQuizAnswer,
  submitQuizAnswers,
}: CourseContentProps) {
  const initialSelectedId = defaultSelectedId || 'none';
  const initialSelectedType = defaultSelectedId ? defaultSelectedType : 'chapter';

  const [selectedItem, setSelectedItem] = useState<{ type: 'chapter' | 'quiz'; id: string }>({
    type: initialSelectedType,
    id: initialSelectedId,
  });
  const [completedChapterIds, setCompletedChapterIds] = useState<string[]>(initialCompletedChapterIds);
  const [progressPercentage, setProgressPercentage] = useState<number>(initialProgressPercentage);
  const [completedQuestions, setCompletedQuestions] = useState<string[]>(
    quizResults.filter((r) => r.isCorrect).map((r) => r.questionId)
  );
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [hasConfettiShown, setHasConfettiShown] = useState<boolean>(progressPercentage >= 100);

  // Trigger confetti only once when progressPercentage reaches 100
  useEffect(() => {
    if (progressPercentage >= 100 && !hasConfettiShown) {
      setShowConfetti(true);
      setHasConfettiShown(true);
    }
  }, [progressPercentage, hasConfettiShown]);

  const selectedChapter = chapters.find((chapter) => chapter._id === selectedItem.id);
  const selectedQuiz = quizzes.find((quiz) => quiz._id === selectedItem.id);

  const handleMarkChapterComplete = async (chapterId: string) => {
    try {
      await markChapterComplete(chapterId);
      if (!completedChapterIds.includes(chapterId)) {
        setCompletedChapterIds((prev) => [...prev, chapterId]);
        const requiredQuestionIds = quizzes
          .filter((q) => q.isRequiredForCompletion)
          .flatMap((q) => q.questions.map((q) => q._id));
        const totalItems = chapters.length + requiredQuestionIds.length;
        const completedItems = completedChapterIds.length + 1 + completedQuestions.filter((id) =>
          requiredQuestionIds.includes(id)
        ).length;
        // setProgressPercentage(totalItems > 0 ? (completedItems / totalItems) * 100 : 0);
        setProgressPercentage(totalItems > 0 ? Math.min((completedItems / totalItems) * 100, 100) : 0);
        toast.success('Chapter marked as complete!');
      }
    } catch (error) {
      toast.error('Failed to mark chapter complete.');
      console.error('Error marking chapter complete:', error);
    }
  };

  const handleSubmitQuizAnswers = async (answers: { questionId: string; selectedOption: number }[]) => {
    try {
      const results = await submitQuizAnswers(answers);
      const selectedQuiz = quizzes.find((q) => q._id === selectedItem.id);
      const isRequired = selectedQuiz?.isRequiredForCompletion || false;
      const newCorrectQuestions = results
        .filter((r) => r.isCorrect)
        .map((r) => r.questionId)
        .filter((id) => !completedQuestions.includes(id));
      setCompletedQuestions((prev) => [...prev, ...newCorrectQuestions]);
      if (isRequired) {
        const requiredQuestionIds = quizzes
          .filter((q) => q.isRequiredForCompletion)
          .flatMap((q) => q.questions.map((q) => q._id));
        const totalItems = chapters.length + requiredQuestionIds.length;
        const completedItems =
          completedChapterIds.length +
          completedQuestions.filter((id) => requiredQuestionIds.includes(id)).length +
          newCorrectQuestions.filter((id) => requiredQuestionIds.includes(id)).length;
        setProgressPercentage(totalItems > 0 ? Math.min((completedItems / totalItems) * 100, 100) : 0);
      }
      return results;
    } catch (error) {
      toast.error('Failed to submit quiz.');
      console.error('Error submitting quiz answers:', error);
      throw error;
    }
  };

  return (
    <div>
      {/* Confetti for course completion */}
      <Confetti trigger={showConfetti} variant="fireworks" onComplete={() => setShowConfetti(false)} />

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-gray-900 dark:text-white">Progress</span>
          <span className="text-gray-900 dark:text-white">{progressPercentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2.5">
          <div
            className="bg-lime-600 h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-2">
          <Sidebar
            chapters={chapters}
            quizzes={quizzes}
            completedChapterIds={completedChapterIds}
            quizResults={quizResults}
            markChapterComplete={handleMarkChapterComplete}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
            {selectedItem.type === 'chapter' && selectedChapter ? (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {selectedChapter.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {selectedChapter.description || 'No description'}
                </p>
                {selectedChapter.videoUrl && (
                  <video
                    controls
                    className="w-full rounded-lg mb-4"
                    src={selectedChapter.videoUrl}
                  ></video>
                )}
                {attachments.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Attachments
                    </h3>
                    <div className="space-y-4">
                      {attachments.map((attachment) => (
                        <div key={attachment._id}>
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lime-600 hover:underline"
                          >
                            {attachment.name}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : selectedItem.type === 'quiz' && selectedQuiz ? (
              <QuizSection
                quizzes={quizzes}
                courseId={courseId}
                userId={userId}
                quizResults={quizResults}
                selectedQuizId={selectedItem.id}
                onQuizSubmit={submitQuizAnswer}
                onQuizAnswersSubmit={handleSubmitQuizAnswers}
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No content available. Select a chapter or quiz.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}