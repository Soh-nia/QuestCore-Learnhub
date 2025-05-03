import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import { FaPlus } from 'react-icons/fa6';
import CourseTable from './CourseTable';
import CourseTableSkeleton from './CourseTableSkeleton';
import Pagination from '@/app/components/Pagination';
import { fetchInstructorCourses } from '@/app/lib/action';

export const metadata: Metadata = {
  title: 'Dashboard - Course List',
  description: 'View all your courses',
};

export default async function InstructorCourses({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'instructor') {
    redirect('/dashboard');
  }

  const { search = '', page = '1' } = await searchParams;
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = 10;

  const { courses, totalCourses = 0, message, errors } = await fetchInstructorCourses({
    search,
    page: pageNumber,
    pageSize,
  });

  if (errors?.server) {
    return <div className="text-red-500 text-center py-10">{message}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen px-2 sm:px-6 lg:px-8 py-10 md:mx-auto max-w-6xl shadow-sm">
      {courses?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-8 my-10">
          <Image
            src="/auth.png"
            width={150}
            height={150}
            alt="No course illustration"
            className="opacity-80 w-32 h-32 sm:w-40 sm:h-40"
          />
          <p className="text-center text-neutral-600 text-base sm:text-lg dark:text-neutral-300">
            No courses yet. Create one by clicking on the Create Course button.
          </p>
          <Link
            href="/dashboard/instructor/courses/create"
            className="flex items-center rounded-lg bg-cyan-500 px-5 py-2.5 text-sm sm:text-base font-bold text-white transition-colors hover:bg-cyan-600"
          >
            Create Course
          </Link>
        </div>
      ) : (
        <Suspense fallback={<CourseTableSkeleton />}>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mx-0 sm:mx-4 mb-6">
            <form className="w-full sm:w-64">
              <input
                type="text"
                name="search"
                defaultValue={search}
                className="py-2.5 px-4 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-cyan-600 focus:ring-cyan-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="Search Course"
              />
            </form>
            <Link
              href="/dashboard/instructor/courses/create"
              className="flex items-center justify-center rounded-lg bg-gray-800 px-5 py-2.5 text-sm sm:text-base font-medium text-white transition-colors hover:bg-gray-700"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              New Course
            </Link>
          </div>
          <CourseTable courses={courses || []} />
          <Pagination itemCount={totalCourses} pageSize={pageSize} currentPage={pageNumber} />
        </Suspense>
      )}
    </div>
  );
}