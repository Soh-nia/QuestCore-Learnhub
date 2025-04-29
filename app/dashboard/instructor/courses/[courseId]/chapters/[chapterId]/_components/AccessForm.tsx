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

interface AccessFormProps {
  initialData: ChapterI;
  chapterId: string;
  courseId: string;
}

const AccessForm = ({ initialData, chapterId, courseId }: AccessFormProps) => {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(updateChapter, initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [isFree, setIsFree] = useState(initialData.isFree || false);
  const router = useRouter();

  const toggleEdit = () => {
    setIsEditing((current) => !current);
    // Reset isFree to initialData when canceling edit
    if (isEditing) {
      setIsFree(initialData.isFree || false);
    }
  };

  useEffect(() => {
    console.log('AccessForm state:', { message: state.message, submittedData: state.submittedData });
    if (state.message?.includes('successfully')) {
      toast.success('Chapter updated successfully!');
      setIsEditing(false);
      // Update isFree state to reflect the submitted value
      if (state.submittedData?.isFree !== undefined) {
        setIsFree(state.submittedData.isFree);
      }
      router.refresh();
    } else if (state.message && !state.message.includes('successfully')) {
      toast.error(state.message);
    }
  }, [state.message, state.submittedData, router]);

  // Debug isFree state
  useEffect(() => {
    console.log('AccessForm isFree:', isFree, 'initialData.isFree:', initialData.isFree);
  }, [isFree, initialData.isFree]);

  return (
    <div className="mt-6 border-neutral-200 bg-neutral-50 rounded-md p-4 dark:border-neutral-700 dark:bg-neutral-800">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-800 dark:text-neutral-200">
          Chapter Access
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
              Edit access
            </>
          )}
        </button>
      </div>
      {!isEditing ? (
        <p className="text-sm text-gray-800 dark:text-neutral-200">
          This chapter is {isFree ? 'free for preview' : 'not free for preview'}.
        </p>
      ) : (
        <form action={formAction}>
          <input type="hidden" name="courseId" value={courseId} />
          <input type="hidden" name="chapterId" value={chapterId} />
          <input type="hidden" name="isFree" value={isFree.toString()} />
          <input type="hidden" name="isPublished" value={initialData.isPublished.toString()} />
          <label className="flex items-center gap-x-2 text-sm text-gray-800 dark:text-neutral-200">
            <input
              type="checkbox"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-lime-600 focus:ring-lime-500 dark:border-neutral-600 dark:bg-neutral-700 dark:checked:bg-lime-600"
            />
            Check this box if you want this chapter to be free
          </label>
          {state.errors?.isFree &&
            state.errors.isFree.map((error: string) => (
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

export default AccessForm;