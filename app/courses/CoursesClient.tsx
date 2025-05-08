'use client';

import { useState } from 'react';
import { Search, BookOpen, Clock, X } from 'lucide-react';
import Image from 'next/image';
import Pagination from '@/app/_components/Pagination';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface Category {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  price: number | null;
  categoryId: string;
  categoryName: string;
  chapterCount: number;
  instructorName: string;
  instructorImage: string;
}

interface CoursesClientProps {
  categories: Category[];
  initialCourses: Course[];
  enrolledCourses: string[];
}

export default function CoursesClient({ categories, initialCourses, enrolledCourses }: CoursesClientProps) {
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const coursesPerPage = 6;

  const currentPage = Number(searchParams.get('page')) || 1;

  // Filter courses based on search query and category
  const filteredCourses = initialCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'All Categories' || course.categoryName === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const handleEnroll = async (course: Course) => {
    // Skip if already enrolled
    if (enrolledCourses.includes(course._id)) {
      toast.success('You are already enrolled in this course!');
      router.push('/dashboard/student/courses');
      return;
    }
    setLoadingCourseId(course._id);
    if (status !== 'authenticated') {
      // Store courseId in localStorage to redirect after signin
      localStorage.setItem('enrollCourseId', course._id);
      router.push('/auth/signin');
      return;
    }

    if (session?.user?.role !== 'student') {
      setIsModalOpen(true);
      return;
    }

    if (course.price) {
      // Paid course: Redirect to payment page
      router.push(`/courses/${course._id}/payment`);
    } else {
      // Free course: Enroll directly
      try {
        const response = await fetch('/api/enroll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId: course._id }),
        });
        if (response.ok) {
          toast.success('Enrolled successfully!');
          router.push('/dashboard/student/courses');
        } else {
          toast.error('Failed to enroll');
        }
      } catch (error) {
        console.error('Enrollment error:', error);
        toast.error('Something went wrong');
      } finally {
        setLoadingCourseId(null);
      }
    }
  };

  const handleStudentSignup = () => {
    setIsModalOpen(false);
    router.push('/auth/signup/student');
  };

  return (
    <>
      {/* Modal for Non-Student Prompt */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Student Enrollment Required
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Only students can enroll in courses. Please sign up as a student to proceed.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleStudentSignup}
                className="px-4 py-2 bg-lime-600 text-white rounded hover:bg-lime-700"
              >
                Sign Up as Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-16 relative">
        <div aria-hidden="true" className="flex -z-1 absolute -top-48 start-0">
          <div className="bg-lime-200 opacity-30 blur-3xl w-[1036px] h-150 dark:bg-lime-900 dark:opacity-20"></div>
          <div className="bg-gray-100 opacity-90 blur-3xl w-[577px] h-75 transform translate-y-32 dark:bg-neutral-800/60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-gray-800 dark:text-lime-100">
            <h1 className="text-4xl font-bold mb-4">Discover Your Next Learning Adventure</h1>
            <p className="text-lg mb-8">
              Explore thousands of courses taught by industry experts and transform your skills
              today.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto shadow-md">
              <input
                type="text"
                placeholder="Search for courses..."
                className="w-full p-4 pl-12 pr-10 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:bg-neutral-800 dark:text-white dark:placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-4 text-gray-500 dark:text-gray-400" size={20} />
              {searchQuery && (
                <button
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Category Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-4 min-w-max my-2">
            {['All Categories', ...categories.map((cat) => cat.name)].map((category) => (
              <button
                key={category}
                className={`px-5 py-2 rounded-full transition text-sm font-medium ${
                  activeCategory === category
                    ? 'bg-lime-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-neutral-800 dark:text-gray-200 dark:hover:bg-neutral-700'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* All Courses Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : activeCategory !== 'All Categories'
              ? `${activeCategory} Courses`
              : 'All Courses'}
          </h2>

          {paginatedCourses.length === 0 ? (
            <div className="text-center bg-white rounded-lg shadow-md py-16 dark:bg-neutral-800">
              <BookOpen className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500" />
              <h3 className="mt-6 text-2xl font-medium text-gray-900 dark:text-white">
                No courses found
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCourses.map((course) => {
                const isEnrolled = enrolledCourses.includes(course._id);
                return (
                  <div
                    key={course._id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow flex flex-col h-[450px] dark:bg-neutral-800"
                  >
                    <div className="relative h-48">
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <span className="px-2 py-1 bg-lime-100 text-gray-800 text-xs font-medium rounded dark:bg-lime-900 dark:text-lime-100">
                          {course.categoryName}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-lime-600 line-clamp-2 dark:text-white dark:hover:text-lime-400">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 dark:text-gray-300">
                        {course.description || 'No description available.'}
                      </p>
                      <div className="flex items-center my-4">
                        <Image
                          src={course.instructorImage || '/default.jpg'}
                          alt={course.instructorName}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {course.instructorName}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.chapterCount} chapters
                      </div>
                      <div className="mt-auto flex justify-between items-center">
                        <span className="text-xl font-bold text-lime-600 dark:text-lime-400">
                          {course.price ? `$${course.price.toFixed(2)}` : 'Free'}
                        </span>
                        <button
                          onClick={() => handleEnroll(course)}
                          disabled={loadingCourseId === course._id || isEnrolled}
                          className={`flex items-center justify-center bg-lime-100 font-semibold text-lg hover:bg-lime-200 text-lime-600 px-3 py-1 rounded-full transition duration-150 ease-in-out ${
                            loadingCourseId === course._id || isEnrolled
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                        >
                          {loadingCourseId === course._id ? (
                            <svg
                              className="animate-spin h-5 w-5 text-lime-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : isEnrolled ? (
                            'Enrolled'
                          ) : (
                            'Enroll'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {filteredCourses.length > 0 && (
            <div className="mt-12 flex justify-center">
              <Pagination
                itemCount={filteredCourses.length}
                pageSize={coursesPerPage}
                currentPage={currentPage}
              />
            </div>
          )}
        </section>
      </main>
    </>
  );
}