'use client';

import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Link from 'next/link';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface CertificateData {
  courseId: string;
  courseTitle: string;
  completionDate: string;
}

interface AnalyticsData {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  averageProgress: number;
  progressDistribution: { range: string; count: number }[];
  totalQuizzesAttempted: number;
  averageQuizScore: number;
  quizSuccessRate: number;
  totalCertificates: number;
  certificates: CertificateData[];
}

interface AnalyticsClientProps {
  analyticsData: AnalyticsData;
  user: { name: string; id: string };
}

export default function AnalyticsClient({ analyticsData }: AnalyticsClientProps) {
  // Bar chart for progress distribution
  const progressChartData = {
    labels: analyticsData.progressDistribution.map((d) => d.range),
    datasets: [
      {
        label: 'Number of Courses',
        data: analyticsData.progressDistribution.map((d) => d.count),
        backgroundColor: ['#84cc16', '#a3e635', '#d4d4d8', '#3b82f6'],
      },
    ],
  };

  // Pie chart for quiz success rate
  const quizChartData = {
    labels: ['Correct Answers', 'Incorrect Answers'],
    datasets: [
      {
        data: [
          analyticsData.quizSuccessRate,
          100 - analyticsData.quizSuccessRate,
        ],
        backgroundColor: ['#84cc16', '#ef4444'],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Learning Analytics
        </h1>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Courses</h3>
            <p className="text-3xl font-bold text-lime-600 mt-2">{analyticsData.totalCourses}</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Completed Courses</h3>
            <p className="text-3xl font-bold text-lime-600 mt-2">{analyticsData.completedCourses}</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">In Progress</h3>
            <p className="text-3xl font-bold text-lime-600 mt-2">{analyticsData.inProgressCourses}</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Average Progress</h3>
            <p className="text-3xl font-bold text-lime-600 mt-2">{analyticsData.averageProgress.toFixed(0)}%</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quizzes Attempted</h3>
            <p className="text-3xl font-bold text-lime-600 mt-2">{analyticsData.totalQuizzesAttempted}</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Certificates Earned</h3>
            <p className="text-3xl font-bold text-lime-600 mt-2">{analyticsData.totalCertificates}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Progress Distribution
            </h3>
            <Bar
              data={progressChartData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'top' }, title: { display: true, text: 'Courses by Progress Range' } },
              }}
            />
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quiz Success Rate
            </h3>
            <Pie
              data={quizChartData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'top' }, title: { display: true, text: 'Quiz Performance' } },
              }}
            />
          </div>
        </div>

        {/* Certificates Table */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white p-6">Earned Certificates</h3>
          {analyticsData.certificates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No certificates earned yet.</p>
              <Link
                href="/dashboard/student/courses"
                className="mt-2 inline-block px-4 py-2 bg-lime-600 text-white rounded hover:bg-lime-700"
              >
                View Courses
              </Link>
            </div>
          ) : (
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
                {analyticsData.certificates.map((certificate) => (
                  <tr key={certificate.courseId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {certificate.courseTitle}
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
          )}
        </div>
      </div>
    </main>
  );
}