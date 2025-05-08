import CourseTableSkeleton from "./CourseTableSkeleton"
import { FaPlus } from "react-icons/fa6"
import LinkWithProgress from "@/app/_components/link-with-progress";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen px-2 sm:px-6 lg:px-8 py-10 md:mx-auto max-w-6xl shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mx-0 sm:mx-4 mb-6">
        <div className="w-full sm:w-64 h-10 bg-gray-200 dark:bg-neutral-700 rounded-lg animate-pulse"></div>
        <LinkWithProgress
          href="/dashboard/instructor/courses/create"
          className="flex items-center justify-center rounded-lg bg-gray-800 px-5 py-2.5 text-sm sm:text-base font-medium text-white transition-colors hover:bg-gray-700"
        >
          <FaPlus className="mr-2 h-4 w-4" />
          New Course
        </LinkWithProgress>
      </div>
      <CourseTableSkeleton />
    </div>
  )
}
