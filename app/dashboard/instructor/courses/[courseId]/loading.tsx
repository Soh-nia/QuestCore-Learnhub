import { Skeleton } from "@/app/_components/Skeleton"
import { RiApps2AiLine } from "react-icons/ri"
import { FaListCheck, FaDollarSign, FaRegFile } from "react-icons/fa6"

export default function Loading() {
  return (
    <main id="content">
      <div className="max-w-[85rem] px-4 sm:px-4 lg:px-6 mx-auto dark:bg-neutral-900">
        <div className="mx-auto mb-8 lg:mb-10">
          <Skeleton className="h-10 w-96" />
        </div>

        <div className="py-10 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
          <div className="flex items-center justify-between px-4">
            <div className="flex flex-col gap-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-36" />
            </div>
            <div className="flex gap-x-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 px-4">
            <div>
              <div className="flex items-center gap-x-2">
                <RiApps2AiLine className="h-6 w-6 text-lime-600" />
                <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">Customize your course</h3>
              </div>

              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="mt-6 border-neutral-200 bg-neutral-50 rounded-md p-4">
                  <div className="flex justify-between items-center mb-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <FaListCheck className="h-6 w-6 text-lime-600" />
                  <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">Course Chapters</h3>
                </div>
                <div className="mt-6 border-neutral-200 bg-neutral-50 rounded-md p-4">
                  <div className="flex justify-between items-center mb-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <FaDollarSign className="h-6 w-6 text-lime-600" />
                  <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">Sell your course</h3>
                </div>
                <div className="mt-6 border-neutral-200 bg-neutral-50 rounded-md p-4">
                  <div className="flex justify-between items-center mb-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <FaRegFile className="h-6 w-6 text-lime-600" />
                  <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">Resources & Attachments</h3>
                </div>
                <div className="mt-6 border-neutral-200 bg-neutral-50 rounded-md p-4">
                  <div className="flex justify-between items-center mb-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
