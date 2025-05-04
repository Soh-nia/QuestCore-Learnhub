'use client';

import Link from 'next/link';

interface CertificateData {
  courseId: string;
  courseTitle: string;
  instructorName: string;
  completionDate: string;
}

interface CertificatesClientProps {
  certificates: CertificateData[];
  user: { name: string; id: string };
}

export default function CertificatesClient({ certificates }: CertificatesClientProps) {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          My Certificates
        </h1>
        {certificates.length === 0 ? (
          <div className="text-center bg-white dark:bg-neutral-800 rounded-lg shadow-md py-16">
            <h3 className="text-2xl font-medium text-gray-900 dark:text-white">
              No certificates earned
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Complete courses to earn certificates!
            </p>
            <Link
              href="/dashboard/student/courses"
              className="mt-4 inline-block px-6 py-2 bg-lime-600 text-white rounded hover:bg-lime-700"
            >
              View Courses
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Course Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Instructor
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Completion Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                {certificates.map((certificate) => (
                  <tr key={certificate.courseId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {certificate.courseTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {certificate.instructorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {certificate.completionDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/dashboard/student/courses/${certificate.courseId}/certificate`}
                        target="_blank"
                        className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
                      >
                        View Certificate
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}