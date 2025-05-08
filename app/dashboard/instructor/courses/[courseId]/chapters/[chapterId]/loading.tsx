import { Skeleton } from "@/app/_components/Skeleton"
import { RiApps2AiLine, RiVideoLine } from "react-icons/ri"
import { AiTwotoneEye } from "react-icons/ai"
import { IoMdArrowRoundBack } from "react-icons/io"
import LinkWithProgress from "@/app/_components/link-with-progress"

export default function Loading() {
  return (
    <main id="content">
      <div className="max-w-[85rem] px-4 sm:px-4 lg:px-6 mx-auto dark:bg-neutral-900 my-14">
        <div className="flex items-center justify-between mx-auto mb-8 lg:mb-10">
          <LinkWithProgress
            href={`/dashboard/instructor/courses`}
            className="py-3 px-4 flex items-center gap-x-2 text-base font-medium rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          >
            <IoMdArrowRoundBack />
            Back to course setup
          </LinkWithProgress>
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
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <RiApps2AiLine className="h-6 w-6 text-lime-500" />
                  <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">Customize your chapter</h3>
                </div>

                {[1, 2].map((i) => (
                  <div key={i} className="mt-6 border-neutral-200 bg-neutral-50 rounded-md p-4">
                    <div className="flex justify-between items-center mb-3">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <AiTwotoneEye className="h-6 w-6 text-lime-500" />
                  <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">Access Settings</h3>
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
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <RiVideoLine className="h-6 w-6 text-lime-500" />
                  <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">Video</h3>
                </div>
                <div className="mt-6 border-neutral-200 bg-neutral-50 rounded-md p-4">
                  <div className="flex justify-between items-center mb-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                  <Skeleton className="h-60 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
