'use client';

import { useState, useTransition, useEffect } from 'react';
import toast from 'react-hot-toast';

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

interface QuizSectionProps {
  quizzes: Quiz[];
  courseId: string;
  userId: string;
  quizResults: { questionId: string; isCorrect: boolean }[];
  selectedQuizId: string;
  onQuizSubmit: (questionId: string, selectedOption: number) => Promise<void>;
  onQuizAnswersSubmit: (
    answers: { questionId: string; selectedOption: number }[]
  ) => Promise<{ questionId: string; isCorrect: boolean }[]>;
}

export default function QuizSection({
  quizzes,
  quizResults,
  selectedQuizId,
  onQuizAnswersSubmit,
}: QuizSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const selectedQuiz = quizzes.find((quiz) => quiz._id === selectedQuizId);

  // Initialize answers scoped to selected quiz
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [submissionResults, setSubmissionResults] = useState<
    { questionId: string; isCorrect: boolean }[] | null
  >(null);

  // Update answers when quiz changes or quizResults update
  useEffect(() => {
    if (!selectedQuiz) {
      setAnswers({});
      setSubmissionResults(null);
      setCurrentQuestionIndex(0);
      return;
    }

    const newAnswers = quizResults.reduce((acc: { [key: string]: number }, result) => {
      if (selectedQuiz.questions.some((q) => q._id === result.questionId)) {
        const question = selectedQuiz.questions.find((q) => q._id === result.questionId);
        if (question && result.isCorrect) {
          acc[result.questionId] = question.correctAnswer;
        }
      }
      return acc;
    }, {});
    setAnswers(newAnswers);
    setSubmissionResults(null);
    setCurrentQuestionIndex(0);
  }, [selectedQuizId, quizResults, selectedQuiz]);

  if (!selectedQuiz || !selectedQuiz.questions.length) {
    return <div className="text-gray-500 dark:text-gray-400">No quiz available</div>;
  }

  const handleOptionChange = (questionId: string, optionIndex: number) => {
    if (selectedQuiz.questions.some((q) => q._id === questionId)) {
      setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmitQuiz = async () => {
    const quizAnswers = selectedQuiz.questions
      .map((question) => ({
        questionId: question._id,
        selectedOption: answers[question._id],
      }))
      .filter((answer) => answer.selectedOption !== undefined);
    if (quizAnswers.length !== selectedQuiz.questions.length) {
      toast.error('Please answer all questions.');
      return;
    }
    startTransition(async () => {
      try {
        const results = await onQuizAnswersSubmit(quizAnswers);
        setSubmissionResults(results);
        // Update answers with submitted values to persist them
        const updatedAnswers = { ...answers };
        quizAnswers.forEach(({ questionId, selectedOption }) => {
          updatedAnswers[questionId] = selectedOption;
        });
        setAnswers(updatedAnswers);
        toast.success('Quiz submitted! Check your results.');
      } catch (error) {
        toast.error('Failed to submit quiz.');
        console.error('Quiz Submit Error:', error);
      }
    });
  };

  const question = selectedQuiz.questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === selectedQuiz.questions.length - 1;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Quiz: {selectedQuiz.title}
      </h2>
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
        {submissionResults ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quiz Results</h3>
            {selectedQuiz.questions.map((q) => {
              const result = submissionResults.find((r) => r.questionId === q._id);
              return (
                <div key={q._id} className="mb-6 flex items-center">
                  <p className="text-gray-900 dark:text-white font-medium flex-1">{q.text}</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your answer: {answers[q._id] !== undefined ? q.options[answers[q._id]] : 'Not answered'}
                  </p>
                  <p className={`text-sm ml-4 flex items-center ${result?.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {result?.isCorrect ? '✔ Correct' : 'Incorrect'}
                  </p>
                </div>
              );
            })}
            <button
              onClick={() => setSubmissionResults(null)}
              className="px-4 py-2 bg-lime-600 text-white rounded hover:bg-lime-700"
            >
              Retake Quiz
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{question.text}</h3>
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <label key={index} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name={`quiz-option-${question._id}`}
                    value={index}
                    checked={answers[question._id] === index}
                    onChange={() => handleOptionChange(question._id, index)}
                    className="form-radio text-lime-600"
                    disabled={isPending}
                  />
                  <span className="text-gray-900 dark:text-white">{option}</span>
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={goToPreviousQuestion}
                disabled={isFirstQuestion || isPending}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleSubmitQuiz}
                disabled={isPending}
                className="px-4 py-2 bg-lime-600 text-white rounded hover:bg-lime-700 disabled:opacity-50"
              >
                {isPending ? 'Submitting...' : 'Submit Quiz'}
              </button>
              <button
                onClick={goToNextQuestion}
                disabled={isLastQuestion || isPending}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}