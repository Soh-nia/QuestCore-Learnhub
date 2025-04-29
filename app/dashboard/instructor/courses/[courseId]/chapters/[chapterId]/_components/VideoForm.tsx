'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LuPencil, LuPlus } from 'react-icons/lu';
import { RiVideoLine } from 'react-icons/ri';
import { useActionState } from 'react';
import { State, updateChapter } from '@/app/lib/action';
import toast from 'react-hot-toast';
import FileUpload from '@/app/components/FileUpload';
import { ChapterI } from '@/types/course';

interface VideoFormProps {
  initialData: ChapterI;
  courseId: string;
  chapterId: string;
}

const VideoForm = ({ initialData, courseId, chapterId }: VideoFormProps) => {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(updateChapter, initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  // Handle success and error toast notifications
  useEffect(() => {
    if (state.message?.includes('successfully')) {
      toast.success('Chapter updated successfully!');
      setIsEditing(false);
      router.refresh();
    } else if (state.message && !state.message.includes('successfully')) {
      toast.error(state.message);
    }
  }, [state.message, router]);

  const handleVideoUpload = (url?: string) => {
    if (url) {
      const formData = new FormData();
      formData.append('courseId', courseId);
      formData.append('chapterId', chapterId);
      formData.append('videoUrl', url);
      startTransition(() => {
        formAction(formData);
      });
    }
  };

  return (
    <div className="mt-6 border-neutral-200 bg-neutral-50 rounded-md p-4 dark:border-neutral-700 dark:bg-neutral-800">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-800 dark:text-neutral-200">
          Chapter Video
        </span>
        <button
          onClick={toggleEdit}
          className="py-1.5 px-2 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          {isEditing ? (
            <span>Cancel</span>
          ) : !initialData.videoUrl ? (
            <>
              <LuPlus className="w-4 h-4" />
              Add a video
            </>
          ) : (
            <>
              <LuPencil className="w-4 h-4" />
              Edit video
            </>
          )}
        </button>
      </div>
      {!isEditing && !initialData.videoUrl ? (
        <div className="flex items-center justify-center h-60 bg-slate-100 rounded-md dark:bg-neutral-700">
          <RiVideoLine className="w-10 h-10 text-lime-500" />
        </div>
      ) : !isEditing && initialData.videoUrl ? (
        <div className="relative aspect-video mt-2">
          <video
            className="w-full h-full rounded-md"
            controls
            poster={'/placeholder-video-thumbnail.jpg'}
            >
            <source src={initialData.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
            </video>
        </div>
      ) : null}
      {isEditing && (
        <div>
          <div className={isPending ? 'opacity-50 pointer-events-none' : ''}>
            <FileUpload
              endpoint="chapterVideo"
              onChange={handleVideoUpload}
            />
          </div>
          {isPending && (
            <div className="text-sm text-gray-600 dark:text-neutral-400 mt-2">
              Uploading and saving...
            </div>
          )}
          {state.errors?.videoUrl &&
            state.errors.videoUrl.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          {state.message && !state.message.includes('successfully') && (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          )}
        </div>
      )}
      {!isEditing && initialData.videoUrl && (
        <div className="text-sm text-gray-600 dark:text-neutral-400 mt-4">
          Videos can take a few minutes to process. Refresh the page if the video does not appear.
        </div>
      )}
    </div>
  );
};

export default VideoForm;