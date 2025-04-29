'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LuPencil } from 'react-icons/lu';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { updateChapter, State } from '@/app/lib/action';
import Spinner from '@/app/components/Spinner';
import toast from 'react-hot-toast';
import { ChapterI } from '@/types/course';

interface TitleFormProps {
  initialData: ChapterI;
  chapterId: string;
  courseId: string;
}

const TitleForm = ({ initialData, chapterId, courseId }: TitleFormProps) => {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(updateChapter, initialState);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  useEffect(() => {
    if (state.message?.includes('successfully')) {
      toast.success('Chapter title updated successfully!');
      setIsEditing(false);
      router.refresh();
    } else if (state.message && !state.message.includes('successfully')) {
      toast.error(state.message);
    }
  }, [state.message, router]);

  return (
    <div className="mt-6 border-neutral-200 bg-neutral-50 rounded-md p-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-800 dark:text-neutral-200">
          Chapter Title
        </span>
        <button
          onClick={toggleEdit}
          className="py-1.5 px-2 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          {isEditing ? (
            <span>Cancel</span>
          ) : (
            <>
              <LuPencil className="w-4 h-4" />
              Edit title
            </>
          )}
        </button>
      </div>
      {!isEditing && (
        <p className="text-sm mt-2 text-gray-800 dark:text-neutral-200">
          {initialData.title || 'No title set'}
        </p>
      )}
      {isEditing && (
        <form action={formAction}>
          <input type="hidden" name="courseId" value={courseId} />
          <input type="hidden" name="chapterId" value={chapterId} />
          <input
            type="text"
            name="title"
            defaultValue={initialData.title || ''}
            className="p-3 sm:p-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-cyan-500 focus:ring-cyan-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="e.g. Introduction to the course..."
          />
          {state.errors?.title &&
            state.errors.title.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          <SubmitButton />
        </form>
      )}
    </div>
  );
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mx-1 my-2 py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-lime-600 text-white shadow-2xs hover:bg-lime-700 focus:outline-none focus:bg-lime-700 disabled:opacity-50 disabled:pointer-events-none"
    >
      Save {pending && <Spinner />}
    </button>
  );
}

export default TitleForm;