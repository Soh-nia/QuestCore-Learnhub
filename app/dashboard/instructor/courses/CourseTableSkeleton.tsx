import { PiDotsThreeOutlineFill } from "react-icons/pi";

const CourseTableSkeleton = () => {
    return (
      <div className="overflow-x-auto m-10">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-md"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm">
                      <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
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

  export default CourseTableSkeleton;