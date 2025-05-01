'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Lusitana } from 'next/font/google';

const lusitana = Lusitana({ subsets: ['latin'], weight: ['400', '700'], });

interface Category {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  categoryName: string | null;
  chapterCount: number;
  instructorName: string;
  instructorImage: string | null;
}

interface CoursesByCategory {
  categoryId: string;
  categoryName: string;
  courses: Course[];
  totalCourses: number;
}

interface HomeClientProps {
  categories: Category[];
  initialCoursesByCategory: CoursesByCategory[];
}

export default function HomeClient({ categories, initialCoursesByCategory }: HomeClientProps) {
  const [activeTab, setActiveTab] = useState(categories[0]?._id || '');
  const [coursesByCategory, setCoursesByCategory] = useState(initialCoursesByCategory);
  const [showAll, setShowAll] = useState<{ [key: string]: boolean }>({});

  const handleGetAll = async (categoryId: string) => {
    if (showAll[categoryId]) return;

    try {
      const response = await fetch(`/api/courses?categoryId=${categoryId}`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();

      setCoursesByCategory((prev) =>
        prev.map((cat) =>
          cat.categoryId === categoryId
            ? { ...cat, courses: data.courses, totalCourses: data.totalCourses }
            : cat
        )
      );
      setShowAll((prev) => ({ ...prev, [categoryId]: true }));
    } catch (error) {
      console.error('Error fetching all courses:', error);
    }
  };

  return (
    <>
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h2 className="text-2xl font-bold md:text-4xl md:leading-tight text-gray-800 dark:text-white">
          Explore Our Latest Courses
        </h2>
        <p className="mt-1 text-gray-600 dark:text-neutral-400">
          See how game-changing learners are making the most of every engagement with{' '}
          <span className={`text-3xl font-bold text-lime-500 ${lusitana.className}`}>
            QuestCore
          </span>.
        </p>
      </div>

      <nav
        className="pb-1 flex gap-x-1 overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        aria-label="Tabs"
        role="tablist"
        aria-orientation="horizontal"
      >
        {categories.map((category) => (
          <button
            key={category._id}
            type="button"
            className={`hs-tab-active:font-bold hs-tab-active:border-cyan-500 hs-tab-active:text-cyan-500 py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-cyan-500 focus:outline-hidden focus:text-cyan-500 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-cyan-500 ${
              activeTab === category._id ? 'active' : ''
            }`}
            id={`horizontal-scroll-tab-item-${category._id}`}
            aria-selected={activeTab === category._id}
            data-hs-tab={`#horizontal-scroll-tab-${category._id}`}
            aria-controls={`horizontal-scroll-tab-${category._id}`}
            role="tab"
            onClick={() => setActiveTab(category._id)}
          >
            {category.name}
          </button>
        ))}
      </nav>

      <div className="mt-3">
        {categories.map((category) => {
          const categoryData = coursesByCategory.find(
            (data) => data.categoryId === category._id
          );
          const courses = categoryData?.courses || [];
          const totalCourses = categoryData?.totalCourses || 0;

          return (
            <div
              key={category._id}
              id={`horizontal-scroll-tab-${category._id}`}
              className={activeTab === category._id ? '' : 'hidden'}
              role="tabpanel"
              aria-labelledby={`horizontal-scroll-tab-item-${category._id}`}
            >
              {courses.length === 0 ? (
                <div className="text-center py-10">
                  <Image
                    src="/auth.png"
                    alt="No courses available"
                    width={300}
                    height={200}
                    className="mx-auto"
                  />
                  <p className="mt-4 text-gray-600 dark:text-neutral-400">
                    No courses available in this category. Explore other categories or check back later.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <Link
                        key={course._id}
                        className="group flex flex-col h-full border border-gray-200 hover:border-transparent hover:shadow-lg focus:outline-hidden focus:border-transparent focus:shadow-lg transition duration-300 rounded-xl p-5 dark:border-neutral-700 dark:hover:border-transparent dark:hover:shadow-black/40 dark:focus:border-transparent dark:focus:shadow-black/40"
                        href={`/auth/signup`}
                      >
                        <div className="aspect-w-16 aspect-h-11">
                          <Image
                            className="w-full object-cover rounded-xl"
                            src={course.imageUrl || 'https://images.unsplash.com/photo-1633114128174-2f8aa49759b0'}
                            width={560}
                            height={80}
                            alt={course.title}
                          />
                        </div>
                        <div className="my-6">
                          <h3 className="text-2xl font-semibold text-gray-800 dark:text-neutral-300 dark:group-hover:text-white">
                            {course.title}
                          </h3>
                          <p className="mt-2 text-gray-600 dark:text-neutral-400">
                            {course.description}
                          </p>
                          <div className="flex gap-x-3 items-center mt-2">
                            <p className="text-sm text-gray-600 dark:text-neutral-400">
                                <span className='font-bold'>Category:</span> {course.categoryName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-neutral-400">
                            <span className='font-bold'>Chapters:</span> {course.chapterCount}
                            </p>
                          </div>
                          <p className="mt-2 text-2xl font-extrabold text-gray-800 dark:text-neutral-200">
                            {course.price ? `$${course.price.toFixed(2)}` : 'Free'}
                          </p>
                        </div>
                        <div className="mt-auto flex items-center gap-x-3">
                          <Image
                            className="size-10 rounded-full"
                            src={course.instructorImage || '/default.jpg'}
                            width={32}
                            height={32}
                            alt={course.instructorName}
                          />
                          <div>
                            <h5 className="text-sm text-gray-800 font-semibold dark:text-neutral-200">
                              By {course.instructorName}
                            </h5>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {totalCourses > 3 && !showAll[category._id] && (
                    <div className="mt-12 text-center">
                      <button
                        className="py-3 px-4 inline-flex items-center gap-x-1 text-sm font-medium rounded-full border border-gray-200 bg-white text-cyan-600 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-blue-500 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                        onClick={() => handleGetAll(category._id)}
                      >
                        Get All
                        <svg
                          className="shrink-0 size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}