import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import connectMongoose from '@/lib/mongoose-connect';
import User from '@/models/User';
// import Image from 'next/image';
// import Link from 'next/link';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Dashboard - Enrolled Course List',
  description: 'View all your courses',
};

export default async function StudentDashboard() {
  const session = await auth();
  if (!session || session.user.role !== 'student') {
    redirect('/auth/signin');
  }

  await connectMongoose();

  const user = await User.findById(session.user.id).populate('enrolledCourses');
  if (!user) {
    return <div>Error: User not found</div>;
  }

  // const enrolledCourses = user.enrolledCourses || [];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          My Courses
        </h1>
        {/* {enrolledCourses.length === 0 ? (
          <div className="text-center bg-white dark:bg-neutral-800 rounded-lg shadow-md py-16">
            <h3 className="text-2xl font-medium text-gray-900 dark:text-white">
              No courses enrolled
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Explore courses to start learning!
            </p>
            <Link
              href="/courses"
              className="mt-4 inline-block px-6 py-2 bg-lime-600 text-white rounded hover:bg-lime-700"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course: [any]) => (
              <div
                key={course._id}
                className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={course.imageUrl || 'https://images.unsplash.com/photo-1633114128174-2f8aa49759b0'}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-3">
                    {course.description || 'No description available.'}
                  </p>
                  <Link
                    href={`/courses/${course._id}`}
                    className="mt-4 inline-block px-4 py-2 bg-lime-600 text-white rounded hover:bg-lime-700"
                  >
                    Continue Learning
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )} */}
      </div>
    </main>
  );
}