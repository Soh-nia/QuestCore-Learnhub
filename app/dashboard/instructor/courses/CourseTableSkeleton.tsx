import { PiDotsThreeOutlineFill } from "react-icons/pi"
import { Skeleton } from "@/app/_components/Skeleton"

const CourseTableSkeleton = () => {
  return (
    <div className="overflow-x-auto mx-0 sm:mx-4 my-6">
      <div className="p-1.5 min-w-full inline-block align-middle">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="hidden sm:table-cell px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                >
                  Image
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="hidden sm:table-cell px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="hidden sm:table-cell px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                >
                  <PiDotsThreeOutlineFill className="h-5 w-5" />
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr
                  key={index}
                  className="odd:bg-white even:bg-gray-100 dark:odd:bg-neutral-900 dark:even:bg-neutral-800"
                >
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm">
                    <Skeleton className="w-12 h-12 rounded-md" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Skeleton className="h-4 w-32 rounded" />
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm">
                    <Skeleton className="h-4 w-24 rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Skeleton className="h-4 w-16 rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm">
                    <Skeleton className="h-4 w-24 rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-end text-sm">
                    <div className="flex items-center justify-end gap-x-2">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <Skeleton className="h-8 w-16 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CourseTableSkeleton
