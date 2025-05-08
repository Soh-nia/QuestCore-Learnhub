import { auth } from "@/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import connectMongoose from '@/lib/mongoose-connect';
import User from "@/models/User";
import Course from "@/models/Course";
import Image from "next/image";
import mongoose from "mongoose";
import Pagination from "@/app/_components/Pagination";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { Skeleton } from "@/app/_components/Skeleton";

interface RawLeanCourse {
  _id: mongoose.Types.ObjectId;
  title: string;
  price: number | null;
}

interface RawLeanUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  image: string | null;
  enrolledCourses: mongoose.Types.ObjectId[];
}

interface LeanCourse {
  _id: string;
  title: string;
  price: number | null;
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

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export const dynamic = "force-dynamic";

// Cache the enrollment data fetching function
const getEnrollmentData = unstable_cache(
  async (userId: string) => {
    await connectMongoose();

    // Optimize query with projection and indexing
    const rawCourses = (await Course.find({
      userId,
      isPublished: true,
    })
      .select("title price")
      .lean()
      .exec()) as unknown as RawLeanCourse[];

    const courses: LeanCourse[] = rawCourses.map((course) => ({
      _id: course._id.toString(),
      title: course.title || "",
      price: course.price || null,
    }));

    if (courses.length === 0) {
      return { courses, users: [], enrollments: [] };
    }

    // Only fetch necessary fields and use $in operator efficiently
    const courseIds: mongoose.Types.ObjectId[] = courses.map((course) => new mongoose.Types.ObjectId(course._id));

    // Use aggregation for better performance with large datasets
    const rawUsers = (await User.find({
      enrolledCourses: { $in: courseIds },
    })
      .select("name image enrolledCourses")
      .lean()
      .exec()) as unknown as RawLeanUser[];

    const users: LeanUser[] = rawUsers.map((user) => ({
      _id: user._id.toString(),
      name: user.name || "Unknown Student",
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
                    image: user.image || "/default.jpg",
                  },
                }
              : null;
          }),
      )
      .filter((enrollment): enrollment is Enrollment => enrollment !== null);

    return { courses, users, enrollments };
  },
  ["instructor-enrollments-data"],
  {
    revalidate: 60 * 5,
    tags: ["instructor-enrollments"],
  },
);

// Loading component for Suspense
function EnrollmentsTableSkeleton() {
  return (
    <div className="overflow-x-auto mx-0 sm:mx-4 my-6">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md min-w-full inline-block align-middle">
        <div className="overflow-hidden">
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
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-40" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-20" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-32" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

async function EnrollmentsTable({ userId, page }: { userId: string; page: number }) {
  const { enrollments } = await getEnrollmentData(userId);

  const pageSize = 10;
  const totalItems = enrollments.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedEnrollments = enrollments.slice(startIndex, startIndex + pageSize);

  if (enrollments.length === 0) {
    return (
      <div className="text-center bg-white dark:bg-neutral-800 rounded-lg shadow-md py-16">
        <h3 className="text-2xl font-medium text-gray-900 dark:text-white">No enrollments found</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Students have not enrolled in your courses yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto mx-0 sm:mx-4 my-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md min-w-full inline-block align-middle">
          <div className="overflow-hidden">
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
                {paginatedEnrollments.map((enrollment, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {enrollment.course.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {enrollment.course.price ? `$${enrollment.course.price.toFixed(2)}` : "Free"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {enrollment.student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Image
                        src={enrollment.student.image || "/placeholder.svg"}
                        alt={enrollment.student.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                        priority={false}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Pagination itemCount={totalItems} pageSize={pageSize} currentPage={page} />
    </>
  );
}

function NoCourses() {
  return (
    <div className="text-center bg-white dark:bg-neutral-800 rounded-lg shadow-md py-16">
      <h3 className="text-2xl font-medium text-gray-900 dark:text-white">No courses found</h3>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        You have no published courses. Create and publish a course to see enrollments.
      </p>
    </div>
  );
}

export default async function InstructorEnrollmentsPage({ searchParams }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "instructor") {
    redirect("/dashboard");
  }

  // Check if the instructor has any courses
  const { courses } = await getEnrollmentData(session.user.id);
  const { page } = await searchParams;
  const currentPage = Number.parseInt(page || "1", 10) || 1;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Course Enrollments</h1>

        {courses.length === 0 ? (
          <NoCourses />
        ) : (
          <Suspense fallback={<EnrollmentsTableSkeleton />}>
            <EnrollmentsTable userId={session.user.id} page={currentPage} />
          </Suspense>
        )}
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: "Dashboard - Enrollment List",
  description: "View all courses enrollments",
};