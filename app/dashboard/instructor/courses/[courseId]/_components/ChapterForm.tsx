'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LuPlus } from 'react-icons/lu';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { createChapter, updateChapterPositions, State } from '@/app/lib/action';
import Spinner from '@/app/_components/Spinner';
import toast from 'react-hot-toast';
import { CourseI } from '@/types/course';
import ChaptersList from './ChaptersList';
import { BiLoaderCircle } from 'react-icons/bi';
import { memo } from "react"

interface ChapterFormProps {
  initialData: CourseI;
  courseId: string;
}

const ChapterForm = memo(function ChapterForm({ initialData, courseId }: ChapterFormProps) {
  const initialState: State = { message: null, errors: {} };
  const [createState, createFormAction] = useActionState(createChapter, initialState);
  const [updateState, updateFormAction] = useActionState(updateChapterPositions, initialState);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [title, setTitle] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const toggleCreate = () => {
    setIsCreating((current) => !current);
    setTitle('');
  };

  useEffect(() => {
    if (createState.message?.includes('successfully')) {
      toast.success('Chapter created successfully!');
      setIsCreating(false);
      setTitle('');
      router.refresh();
    } else if (createState.message && !createState.message.includes('successfully')) {
      toast.error(createState.message);
    }
  }, [createState.message, router]);

  useEffect(() => {
    if (updateState.message) {
      setIsUpdating(false);
      if (updateState.message.includes('successfully')) {
        toast.success('Chapter order updated!');
        router.refresh();
      } else {
        toast.error(updateState.message);
      }
    }
  }, [updateState.message, router]);

  const handleReorder = useCallback(
    (updateData: { id: string; position: number }[]) => {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append('courseId', courseId);
      formData.append('positions', JSON.stringify(updateData));
      startTransition(() => {
        updateFormAction(formData);
      });
    },
    [courseId, updateFormAction]
  );

  const handleEdit = useCallback(
    (chapterId: string) => {
      router.push(`/dashboard/instructor/courses/${courseId}/chapters/${chapterId}`);
    },
    [courseId, router]
  );

  return (
    <div className="relative mt-6 border-neutral-200 bg-neutral-50 rounded-md p-4">
      {isUpdating && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-300/20 rounded-md">
          <BiLoaderCircle className="animate-spin h-6 w-6 text-lime-600" />
        </div>
      )}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-800 dark:text-neutral-200">
          Course Chapters
        </span>
        <button
          onClick={toggleCreate}
          className="py-1.5 px-2 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
          disabled={isPending}
        >
          {isCreating ? <span>Cancel</span> : <><LuPlus className="w-4 h-4" /> Add a chapter</>}
        </button>
      </div>
      <ChaptersList
        items={initialData.chapters || []}
        onReorder={handleReorder}
        onEdit={handleEdit}
        isPending={isPending}
      />
      {isCreating && (
        <form action={createFormAction}>
          <input type="hidden" name="courseId" value={courseId} />
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 sm:p-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-cyan-500 focus:ring-cyan-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="e.g. Introduction..."
            disabled={isPending}
          />
          {createState.errors?.title &&
            createState.errors.title.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          <SubmitButton />
        </form>
      )}
    </div>
  );
})

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mx-1 my-2 py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-lime-600 text-white shadow-2xs hover:bg-lime-700 focus:outline-none focus:bg-lime-700 disabled:opacity-50 disabled:pointer-events-none"
    >
      Create {pending && <Spinner />}
    </button>
  );
}

export default ChapterForm;