'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CourseI } from '@/types/course';
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { LuPencil } from 'react-icons/lu';
import { MdQuiz } from "react-icons/md";

interface CourseTableProps {
  courses: CourseI[];
}

const CourseTable = ({ courses }: CourseTableProps) => {
  return (
    <div className="overflow-x-auto mx-0 sm:mx-4 my-6">
      <div className="p-1.5 min-w-full inline-block align-middle">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
            <thead>
              <tr>
                <th scope="col" className="hidden sm:table-cell px-6 py-3 text-start text-sm font-medium text-gray-500 uppercase dark:text-neutral-500">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 text-start text-sm font-medium text-gray-500 uppercase dark:text-neutral-500">
                  Title
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-3 text-start text-sm font-medium text-gray-500 uppercase dark:text-neutral-500">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-start text-sm font-medium text-gray-500 uppercase dark:text-neutral-500">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-start text-sm font-medium text-gray-500 uppercase dark:text-neutral-500">
                  Status
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-3 text-start text-sm font-medium text-gray-500 uppercase dark:text-neutral-500">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-end text-sm font-medium text-gray-500 uppercase dark:text-neutral-500">
                  <PiDotsThreeOutlineFill className="h-5 w-5" />
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course._id}
                  className="odd:bg-white even:bg-gray-100 dark:odd:bg-neutral-900 dark:even:bg-neutral-800"
                >
                  <td className="hidden sm:table-cell px-4 py-3 whitespace-nowrap text-sm">
                    <Image
                      src={course.imageUrl || '/default.jpg'}
                      width={40}
                      height={40}
                      alt={course.title}
                      className="rounded-md object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                    {course.title}
                  </td>
                  <td className="hidden sm:table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                    {course.categoryName || 'None'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                    {course.price !== null ? `$${course.price.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {course.isPublished ? (
                        <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-800 text-white dark:bg-white dark:text-neutral-800">Published</span>
                    ) : (
                        <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-500 text-white">Draft</span>
                    )}
                    </td>

                  <td className="hidden sm:table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-end">
                    <div className="flex items-center gap-x-2">
                      <Link
                        href={`/dashboard/instructor/courses/${course._id}`}
                        className="flex items-center rounded-lg bg-lime-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-lime-600"
                      >
                        <LuPencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>

                      <Link
                        href={`/dashboard/instructor/courses/${course._id}/quiz`}
                        className="flex items-center rounded-lg bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
                      >
                        <MdQuiz className="h-4 w-4 mr-1" />
                        Quiz
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseTable;