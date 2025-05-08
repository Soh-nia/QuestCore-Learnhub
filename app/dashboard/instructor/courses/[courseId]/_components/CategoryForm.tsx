'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { LuPencil } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { updateCourse, State } from '@/app/lib/action';
import Spinner from '@/app/_components/Spinner';
import { CourseI } from '@/types/course';
import { memo } from "react"

interface Category {
  _id: string;
  name: string;
}

interface CategoryFormProps {
  initialData: CourseI;
  courseId: string;
  categories: Category[];
}

const CategoryForm = memo(function CategoryForm({ initialData, courseId, categories }: CategoryFormProps) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(updateCourse, initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialData.categoryId || '');
  const [isComboboxOpen, setIsComboboxOpen] = useState(false); // Track combobox state
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  // Initialize Preline Combobox and handle open/close events
  useEffect(() => {
    import('preline/preline').then(({ HSComboBox }) => {
      console.log('HSComboBox loaded:', !!HSComboBox);
      if (isEditing) {
        HSComboBox.autoInit();

        // Add event listeners for combobox open/close
        const combobox = document.querySelector('[data-hs-combo-box]');
        if (combobox) {
          combobox.addEventListener('open', () => setIsComboboxOpen(true));
          combobox.addEventListener('close', () => setIsComboboxOpen(false));
        }
      }
    });
  }, [isEditing]);

  // Handle success and toast notification
  useEffect(() => {
    if (state.message?.includes('successfully')) {
      toast.success('Category updated successfully!');
      setIsEditing(false);
      router.refresh();
    }
  }, [state.message, router]);

  // Update selected category when combobox item is clicked
  const handleComboboxSelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    // Update input value to reflect selection
    const input = document.querySelector('input[data-hs-combo-box-input]');
    if (input instanceof HTMLInputElement) {
      input.value = categoryId
        ? categories.find((cat) => cat._id === categoryId)?.name || ''
        : '';
    }
    setIsComboboxOpen(false); // Close combobox on selection
  };

  return (
    <div className="mt-6 border-neutral-200 bg-neutral-50 rounded-md p-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-800 dark:text-neutral-200">
          Course Category
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
              Edit category
            </>
          )}
        </button>
      </div>
      {!initialData.categoryId && !isEditing ? (
        <p className="text-sm text-gray-600 dark:text-neutral-400 italic">
          No category selected
        </p>
      ) : (
        <p className="text-sm mt-2 text-gray-800 dark:text-neutral-200">
          {categories.find((cat) => cat._id === initialData.categoryId)?.name}
        </p>
      )}
      {isEditing && (
        <form action={formAction}>
          <input type="hidden" name="courseId" value={courseId} />
          <div className="w-full inline-flex relative" data-hs-combo-box="">
            <div className="relative w-full">
              <input
                id="category-combobox"
                className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-lime-500 focus:ring-lime-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                type="text"
                role="combobox"
                aria-controls="category-combobox-output"
                aria-expanded={isComboboxOpen}
                defaultValue={
                  selectedCategoryId
                    ? categories.find((cat) => cat._id === selectedCategoryId)?.name || ''
                    : ''
                }
                placeholder="Type or select a category"
                data-hs-combo-box-input=""
              />
              <div className="absolute top-1/2 end-3 -translate-y-1/2" data-hs-combo-box-toggle="">
                <svg
                  className="shrink-0 size-3.5 text-gray-500 dark:text-neutral-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m7 15 5 5 5-5" />
                  <path d="m7 9 5-5 5 5" />
                </svg>
              </div>
            </div>
            <div
              id="category-combobox-output"
              className="absolute z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto dark:bg-neutral-900 dark:border-neutral-700 hidden"
              data-hs-combo-box-output=""
            >
              <div
                className="cursor-pointer py-2 px-4 w-full text-sm text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800"
                tabIndex={0}
                data-hs-combo-box-output-item=""
                onClick={() => handleComboboxSelect('')}
              >
                <div className="flex justify-between items-center w-full">
                  <span data-hs-combo-box-search-text="None" data-hs-combo-box-value="">
                    None
                  </span>
                  {selectedCategoryId === '' && (
                    <span className="hs-combo-box-selected:block">
                      <svg
                        className="shrink-0 size-3.5 text-lime-600 dark:text-lime-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </div>
              </div>
              {categories.map((category, index) => (
                <div
                  key={category._id}
                  className="cursor-pointer py-2 px-4 w-full text-sm text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800"
                  tabIndex={index + 1}
                  data-hs-combo-box-output-item=""
                  onClick={() => handleComboboxSelect(category._id)}
                >
                  <div className="flex justify-between items-center w-full">
                    <span data-hs-combo-box-search-text={category.name} data-hs-combo-box-value={category._id}>
                      {category.name}
                    </span>
                    {selectedCategoryId === category._id && (
                      <span className="hs-combo-box-selected:block">
                        <svg
                          className="shrink-0 size-3.5 text-lime-600 dark:text-lime-500"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <input type="hidden" name="categoryId" value={selectedCategoryId} />
          {state.errors?.categoryId &&
            state.errors.categoryId.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          {state.message && !state.message.includes('successfully') && (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          )}
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
      className="mt-4 py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-lime-600 text-white shadow-2xs hover:bg-lime-700 focus:outline-none focus:bg-lime-700 disabled:opacity-50 disabled:pointer-events-none"
    >
      Save {pending && <Spinner />}
    </button>
  );
}

export default CategoryForm;