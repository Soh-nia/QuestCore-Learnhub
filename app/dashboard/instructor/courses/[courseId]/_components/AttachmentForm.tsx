'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LuPlus, LuTrash2 } from 'react-icons/lu';
import { FaFileAlt } from "react-icons/fa";
import { useActionState } from 'react';
import { addAttachment, deleteAttachment, State } from '@/app/lib/action';
import toast from 'react-hot-toast';
import FileUpload from '@/app/components/FileUpload';
import { CourseI } from '@/types/course';


interface AttachmentFormProps {
    initialData: CourseI;
    courseId: string;
}

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const initialState: State = { message: null, errors: {} };
  const [addState, addFormAction] = useActionState(addAttachment, initialState);
  const [deleteState, deleteFormAction] = useActionState(deleteAttachment, initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  // Handle success and toast notification
  useEffect(() => {
    if (addState.message?.includes('successfully')) {
      toast.success('Attachment added successfully!');
      setIsEditing(false);
      router.refresh();
    } else if (addState.message && !addState.message.includes('successfully')) {
      toast.error(addState.message);
    }

    if (deleteState.message?.includes('successfully')) {
      toast.success('Attachment deleted successfully!');
      router.refresh();
    } else if (deleteState.message && !deleteState.message.includes('successfully')) {
      toast.error(deleteState.message);
    }
  }, [addState.message, deleteState.message, router]);

  const handleFileUpload = (url?: string, fileName?: string) => {
    if (url && fileName) {
      const formData = new FormData();
      formData.append('courseId', courseId);
      formData.append('name', fileName);
      formData.append('url', url);
      startTransition(() => {
        addFormAction(formData);
      });
    }
  };

  const handleDelete = (attachmentId: string) => {
    const formData = new FormData();
    formData.append('courseId', courseId);
    formData.append('attachmentId', attachmentId);
    startTransition(() => {
      deleteFormAction(formData);
    });
  };

  return (
    <div className="mt-6 border-neutral-200 bg-neutral-50 rounded-md p-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-800 dark:text-neutral-200">
          Course Attachment
        </span>
        <button
          onClick={toggleEdit}
          className="py-1.5 px-2 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          {isEditing && (
            <span>Cancel</span>
          )}
          {!isEditing && (
            <>
              <LuPlus className="w-4 h-4" />
              Add a file
            </>
          )}
        </button>
      </div>
      {initialData.attachments.length === 0 && !isEditing ? (
        <p className="text-sm text-gray-600 dark:text-neutral-400 italic">
          No attachments added yet.
        </p>
      ) : (
        <ul className="space-y-2 mb-2">
          {initialData.attachments.map((attachment) => (
            <li
              key={attachment._id}
              className="flex items-center justify-between p-2 bg-white dark:bg-neutral-800 rounded-md"
            >
              <FaFileAlt className='w-4 h-4 mr-1 flex-shrink-0 text-lime-600' />
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-lime-600 hover:underline dark:text-lime-500"
              >
                {attachment.name}
              </a>

              {isEditing && (
                <button
                  onClick={() => handleDelete(attachment._id)}
                  disabled={isPending}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {isEditing && (
        <div>
          <div className={isPending ? 'opacity-50 pointer-events-none' : ''}>
            <FileUpload
              endpoint="courseAttachments"
              onChange={handleFileUpload}
            />
          </div>
          {isPending && (
            <div className="text-sm text-gray-600 mt-2">
              Uploading and saving...
            </div>
          )}
          <div className="text-sm text-gray-700 mt-4">
            Upload PDFs, images, or other resources.
          </div>
          {addState.errors &&
            Object.entries(addState.errors).map(([key, errors]) =>
              errors?.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={`${key}-${error}`}>
                  {error}
                </p>
              ))
            )}
          {addState.message && !addState.message.includes('successfully') && (
            <p className="mt-2 text-sm text-red-500">{addState.message}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;