import { auth } from '@/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import connectMongoose from '@/lib/mongoose-connect';
import Course from '@/models/Course';
import User from '@/models/User';
import mongoose from 'mongoose';
import DashboardCharts from './DashboardCharts';
import Image from 'next/image';

// Define interfaces for raw lean documents
interface RawLeanCourse {
  _id: mongoose.Types.ObjectId;
  title: string;
  price: number | null;
  isPublished: boolean;
  createdAt: Date;
}

interface RawLeanUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  image: string | null;
  enrolledCourses: mongoose.Types.ObjectId[];
}

// Define interfaces for transformed data
interface LeanCourse {
  _id: string;
  title: string;
  price: number | null;
  isPublished: boolean;
  createdAt: Date;
}

interface LeanUser {
  _id: string;
  name: string;
  image: string | null;
  enrolledCourses: string[];
}

interface Enrollment {
  course: {
    title: string;
    price: number | null;
  };
  student: {
    name: string;
    image: string;
  };
}

export default async function InstructorDashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'instructor') {
    redirect('/dashboard');
  }

  await connectMongoose();

  // Fetch instructor's courses
  const rawCourses = (await Course.find({
    userId: session.user.id,
  })
    .select('title price isPublished createdAt')
    .lean()
    .exec()) as unknown as RawLeanCourse[];

  const courses: LeanCourse[] = rawCourses.map((course) => ({
    _id: course._id.toString(),
    title: course.title || '',
    price: course.price || null,
    isPublished: course.isPublished,
    createdAt: course.createdAt,
  }));

  // Fetch users enrolled in these courses
  const courseIds: mongoose.Types.ObjectId[] = courses.map((course) =>
    new mongoose.Types.ObjectId(course._id)
  );
  const rawUsers = (await User.find({
    enrolledCourses: { $in: courseIds },
  })
    .select('name image enrolledCourses')
    .lean()
    .exec()) as unknown as RawLeanUser[];

  const users: LeanUser[] = rawUsers.map((user) => ({
    _id: user._id.toString(),
    name: user.name || 'Unknown Student',
    image: user.image || null,
    enrolledCourses: user.enrolledCourses.map((id: mongoose.Types.ObjectId) => id.toString()),
  }));

  // Create enrollment list
  const enrollments: Enrollment[] = users
    .flatMap((user) =>
      user.enrolledCourses
        .filter((courseId: string) => courses.some((course) => course._id === courseId))
        .map((courseId: string) => {
          const course = courses.find((c) => c._id === courseId);
          return course
            ? {
                course: {
                  title: course.title,
                  price: course.price,
                },
                student: {
                  name: user.name,
                  image: user.image || '/default.jpg',
                },
              }
            : null;
        })
    )
    .filter((enrollment): enrollment is Enrollment => enrollment !== null);

  // Calculate analytics
  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.isPublished).length;
  const totalEnrollments = enrollments.length;
  const totalRevenue = enrollments.reduce(
    (sum, e) => sum + (e.course.price || 0),
    0
  );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Instructor Dashboard
        </h1> */}

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Total Courses
            </h3>
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
              {totalCourses}
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Published Courses
            </h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {publishedCourses}
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Total Enrollments
            </h3>
            <p className="text-2xl font-bold text-lime-600 dark:text-lime-400">
              {totalEnrollments}
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Total Revenue
            </h3>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="mb-8">
          <DashboardCharts courses={courses} enrollments={enrollments} />
        </div>

        {/* Recent Courses Table */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Recent Courses
          </h2>
          <div className="overflow-x-auto">
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md min-w-full inline-block align-middle">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead className="bg-gray-50 dark:bg-neutral-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-neutral-800 dark:divide-neutral-700">
                  {courses.slice(0, 5).map((course) => (
                    <tr key={course._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {course.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {course.price ? `$${course.price.toFixed(2)}` : 'Free'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {course.isPublished ? 'Published' : 'Draft'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Enrollments Table */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Recent Enrollments
          </h2>
          <div className="overflow-x-auto">
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md min-w-full inline-block align-middle">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead className="bg-gray-50 dark:bg-neutral-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Course Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Student Image
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-neutral-800 dark:divide-neutral-700">
                  {enrollments.slice(0, 5).map((enrollment, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {enrollment.course.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {enrollment.course.price
                          ? `$${enrollment.course.price.toFixed(2)}`
                          : 'Free'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {enrollment.student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Image
                          src={enrollment.student.image}
                          alt={enrollment.student.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Dashboard - Overview',
  description: 'View overview',
};