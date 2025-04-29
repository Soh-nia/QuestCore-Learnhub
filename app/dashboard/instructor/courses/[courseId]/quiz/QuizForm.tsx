'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaTrash } from 'react-icons/fa6';
import { createQuiz, updateQuiz } from '@/app/lib/action';
import { QuizI, QuestionI } from '@/types/course';

interface Question {
  _id?: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface QuizFormProps {
  courseId: string;
  quizzes: QuizI[];
}

interface QuestionError {
  text?: string[];
  options?: string[];
  correctAnswer?: string[];
}

const QuizForm = ({ courseId, quizzes }: QuizFormProps) => {
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [isRequired, setIsRequired] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    { text: '', options: ['', ''], correctAnswer: 0 },
  ]);
  // const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [errors, setErrors] = useState<
    Record<string, string[] | undefined | QuestionError[]>
  >({});
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Load quiz data when selectedQuizId changes
  useEffect(() => {
    if (selectedQuizId) {
      startTransition(async () => {
        const response = await fetch(`/api/quizzes/${selectedQuizId}`);
        if (response.ok) {
          const { quiz, questions: quizQuestions } = await response.json();
          setTitle(quiz.title);
          setIsRequired(quiz.isRequiredForCompletion);
          setQuestions(
            quizQuestions.map((q: QuestionI) => ({
              _id: q._id,
              text: q.text,
              options: q.options,
              correctAnswer: q.correctAnswer,
            }))
          );
          setErrors({});
          setMessage(null);
        } else {
          setMessage('Failed to load quiz data.');
        }
      });
    } else {
      // Reset form for new quiz
      setTitle('');
      setIsRequired(false);
      setQuestions([{ text: '', options: ['', ''], correctAnswer: 0 }]);
      setErrors({});
      setMessage(null);
    }
  }, [selectedQuizId]);

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', ''], correctAnswer: 0 }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (
      index: number,
      field: keyof Question,
      value: Question[keyof Question]
    ) => {
    const newQuestions = [...questions];
    if (field === 'options') {
      newQuestions[index].options = value as string[];
    } else if (field === 'correctAnswer') {
      newQuestions[index].correctAnswer = Number(value);
    } else {
      newQuestions[index][field] = value as string;
    }
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options.length < 4) {
      newQuestions[questionIndex].options.push('');
      setQuestions(newQuestions);
    }
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options.length > 2) {
      newQuestions[questionIndex].options.splice(optionIndex, 1);
      if (newQuestions[questionIndex].correctAnswer >= newQuestions[questionIndex].options.length) {
        newQuestions[questionIndex].correctAnswer = newQuestions[questionIndex].options.length - 1;
      }
      setQuestions(newQuestions);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage(null);

    const formData = new FormData();
    formData.append('courseId', courseId);
    formData.append('title', title);
    formData.append('isRequiredForCompletion', isRequired.toString());
    formData.append('questions', JSON.stringify(questions));
    if (selectedQuizId) {
      formData.append('quizId', selectedQuizId);
    }

    startTransition(async () => {
      const action = selectedQuizId ? updateQuiz : createQuiz;
      const result = await action(formData);
      if (result.errors) {
        setErrors(result.errors);
        setMessage(result.message || 'Failed to save quiz.');
      } else {
        setMessage(
          selectedQuizId ? 'Quiz updated successfully.' : 'Quiz created successfully.'
        );
        setSelectedQuizId(null);
        router.refresh();
      }
    });
  };

  return (
    <div className="mx-auto md:mx-20 p-4 sm:p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-neutral-200 mb-6">
        {selectedQuizId ? 'Edit Quiz' : 'Create Quiz'}
      </h2>
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            errors && Object.keys(errors).length > 0
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {message}
        </div>
      )}
      {quizzes.length > 0 && (
        <div className="mb-6">
          <label
            htmlFor="quizSelect"
            className="block text-sm font-medium text-gray-700 dark:text-neutral-300"
          >
            Select Quiz to Edit
          </label>
          <select
            id="quizSelect"
            value={selectedQuizId || ''}
            onChange={(e) => setSelectedQuizId(e.target.value || null)}
            className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 py-2 px-4 text-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
            disabled={isPending}
          >
            <option value="">Create New Quiz</option>
            {quizzes.map((quiz) => (
              <option key={quiz._id} value={quiz._id}>
                {quiz.title}
              </option>
            ))}
          </select>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-neutral-300"
          >
            Quiz Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 py-2 px-4 text-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
            placeholder="Enter quiz title"
            disabled={isPending}
          />
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
              disabled={isPending}
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-neutral-300">
              Required for Course Completion
            </span>
          </label>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
            Questions
          </h3>
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="border p-4 rounded-lg bg-gray-50 dark:bg-neutral-800">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor={`question-${qIndex}`}
                  className="text-sm font-medium text-gray-700 dark:text-neutral-300"
                >
                  Question {qIndex + 1}
                </label>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-600 hover:text-red-800"
                    disabled={isPending}
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
              <input
                type="text"
                id={`question-${qIndex}`}
                value={question.text}
                onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 py-2 px-4 text-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                placeholder="Enter question"
                disabled={isPending}
              />
              <div className="mt-4 space-y-2">
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...question.options];
                        newOptions[oIndex] = e.target.value;
                        updateQuestion(qIndex, 'options', newOptions);
                      }}
                      className="block w-full rounded-lg border-gray-300 bg-gray-100 py-2 px-4 text-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                      placeholder={`Option ${oIndex + 1}`}
                      disabled={isPending}
                    />
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={question.correctAnswer === oIndex}
                      onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                      className="h-4 w-4 text-cyan-500 focus:ring-cyan-500"
                      disabled={isPending}
                    />
                    {question.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(qIndex, oIndex)}
                        className="text-red-600 hover:text-red-800"
                        disabled={isPending}
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                {question.options.length < 4 && (
                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="mt-2 flex items-center text-sm text-cyan-500 hover:text-cyan-600"
                    disabled={isPending}
                  >
                    <FaPlus className="h-4 w-4 mr-1" />
                    Add Option
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addQuestion}
            className="mt-4 flex items-center rounded-lg bg-lime-500 px-4 py-2 text-sm font-medium text-white hover:bg-lime-600 disabled:opacity-50"
            disabled={isPending}
          >
            <FaPlus className="h-4 w-4 mr-2" />
            Add Question
          </button>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push(`/dashboard/instructor/courses/${courseId}`)}
            className="rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 disabled:opacity-50"
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-600 disabled:opacity-50"
            disabled={isPending}
          >
            {isPending
              ? 'Saving...'
              : selectedQuizId
              ? 'Update Quiz'
              : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizForm;