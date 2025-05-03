'use client';

import Link from 'next/link';
import Spinner from '@/app/components/Spinner';
import { useActionState } from 'react';
import { createCourse, State } from '@/app/lib/action';
import { useFormStatus } from 'react-dom';

const CreateForm = () => {
    const initialState: State = { message: null, errors: {} };
    const [state, formAction] = useActionState(createCourse, initialState);

  return (
    <div className="text-center">
          <h3 className="text-4xl sm:text-4xl font-bold text-gray-800 dark:text-neutral-200">
            Name Your Course
          </h3>

          <p className="mt-3 text-gray-600 dark:text-neutral-400">
            What would you like to name your course? Don&apos;t worry you can change this later.
          </p>

          <form action={formAction}>
            <div className="mt-5 sm:mt-10 mx-auto max-w-xl relative">
              
                <div className="relative z-10 flex gap-x-3 p-3 bg-white border border-gray-200 rounded-lg shadow-lg shadow-gray-100 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-gray-900/20">
                  <div className="w-full">
                    <label htmlFor="title" className="block text-sm text-gray-700 font-medium dark:text-white"><span className="sr-only">Course title</span></label>
                    <input type="text"
                    name="title"
                    id="title"
                    className="py-2.5 px-4 block w-full border-transparent rounded-lg focus:border-lime-600 focus:ring-lime-600 dark:bg-neutral-900 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    placeholder="e.g 'Advanced courses'" />
                    <div id="title-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.title &&
                            state.errors.title.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                  </div>
                </div>
              

              <div className="hidden md:block absolute top-0 end-0 -translate-y-12 translate-x-20">
                <svg className="w-16 h-auto text-lime-500" width="121" height="135" viewBox="0 0 121 135" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
                  <path d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
                  <path d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
                </svg>
              </div>

              <div className="hidden md:block absolute bottom-0 start-0 translate-y-10 -translate-x-32">
                <svg className="w-40 h-auto text-cyan-500" width="347" height="188" viewBox="0 0 347 188" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            <div className="mt-5 sm:mt-10">
              <Link className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="/dashboard/instructor/courses">
                Cancel
              </Link>
              <SubmitButton />
            </div>
          </form>
        </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-900 text-white shadow-2xs hover:bg-lime-700 focus:outline-hidden focus:bg-lime-700 disabled:opacity-50 disabled:pointer-events-none">
        Continue {pending && <Spinner />}
    </button>
  );
}

export default CreateForm
