'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LuPencil, LuPlus, LuImage } from 'react-icons/lu';
import { useActionState } from 'react';
import { updateCourse, State } from '@/app/lib/action';
import toast from 'react-hot-toast';
import Image from 'next/image';
import FileUpload from '@/app/components/FileUpload';
import { CourseI } from '@/types/course';

interface ImageFormProps {
  initialData: CourseI;
  courseId: string;
}

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(updateCourse, initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  // Handle success and toast notification
  useEffect(() => {
    if (state.message?.includes('successfully')) {
      toast.success('Course image updated successfully!');
      setIsEditing(false);
      router.refresh();
    }
  }, [state.message, router]);

  const handleImageUpload = (url?: string) => {
    if (url) {
      const formData = new FormData();
      formData.append('courseId', courseId);
      formData.append('imageUrl', url);
      startTransition(() => {
        formAction(formData);
      });
    }
  };

  return (
    <div className="mt-6 border-neutral-200 bg-neutral-50 rounded-md p-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-800 dark:text-neutral-200">
          Course Image
        </span>
        <button
          onClick={toggleEdit}
          className="py-1.5 px-2 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          {isEditing ? (
            <span>Cancel</span>
          ) : !initialData.imageUrl ? (
            <>
              <LuPlus className="w-4 h-4" />
              Add an image
            </>
          ) : (
            <>
              <LuPencil className="w-4 h-4" />
              Edit image
            </>
          )}
        </button>
      </div>
      {!isEditing && !initialData.imageUrl ? (
        <div className="flex items-center justify-center h-60 bg-slate-100 rounded-md">
          <LuImage className="w-10 h-10 text-lime-500" />
        </div>
      ) : !isEditing ? (
        <div className="relative aspect-video mt-2">
          <Image
            alt="upload"
            fill
            className="object-cover rounded-md"
            src={initialData.imageUrl}
          />
        </div>
      ) : null}
      {isEditing && (
        <div>
          <div className={isPending ? 'opacity-50 pointer-events-none' : ''}>
            <FileUpload
              endpoint="courseImage"
              onChange={handleImageUpload}
            />
          </div>
          {isPending && (
            <div className="text-sm text-gray-600 mt-2">
              Uploading and saving...
            </div>
          )}
          <div className="text-sm text-muted-foreground mt-4 text-gray-700">
            16:9 aspect ratio recommended
          </div>
          {state.errors?.imageUrl &&
            state.errors.imageUrl.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          {state.message && !state.message.includes('successfully') && (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageForm;