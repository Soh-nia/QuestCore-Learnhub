'use client';

import { useState, useEffect } from 'react';
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
    const [selectedCategory, setSelectedCategory] = useState(categories[0]?._id || '');
    const [courses, setCourses] = useState<Course[]>(initialCoursesByCategory[0]?.courses || []);
    // const [totalCourses, setTotalCourses] = useState(initialCoursesByCategory[0]?.totalCourses || 0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/courses?categoryId=${selectedCategory}`);
            if (!response.ok) throw new Error('Failed to fetch courses');
            const data = await response.json();
            setCourses(data.courses);
            // setTotalCourses(data.totalCourses);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setCourses([]);
            // setTotalCourses(0);
        } finally {
            setLoading(false);
        }
        };

        if (selectedCategory) {
        // Check if we have initial data for the selected category
        const initialData = initialCoursesByCategory.find(
            (cat) => cat.categoryId === selectedCategory
        );
        if (initialData && initialData.courses.length === initialData.totalCourses) {
            setCourses(initialData.courses);
            // setTotalCourses(initialData.totalCourses);
        } else {
            fetchCourses();
        }
        }
    }, [selectedCategory, initialCoursesByCategory]);

  return (
    <>
    <div className="bg-gray-50 dark:bg-neutral-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Dropdown */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-neutral-200 text-center">
            Explore Our Featured <span className={`text-lime-500 ${lusitana.className}`} >Courses</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-lime-100 text-center">
            Explore our most popular learning courses and skill categories. Select a category to discover top courses
          </p>
          <div className="mt-6 flex justify-center">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full max-w-md px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 text-lg"
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Courses Section */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {categories.find((cat) => cat._id === selectedCategory)?.name || 'Courses'}
            </h2>
            <Link
              href="/courses"
              className="text-lg text-lime-600 hover:text-lime-800 font-medium transition duration-150 ease-in-out"
            >
              View all courses
            </Link>
          </div>

          {loading ? (
            <div className="text-center text-gray-600">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="text-center text-gray-600 font-bold text-1xl my-5">No courses found for this category.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <Image
                      width={400}
                      height={200}
                      src={course.imageUrl || '/api/placeholder/400/200'}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-lime-600 text-white text-xs font-bold px-2 py-1 rounded">
                      New
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center text-sm mb-2">
                      <span className="text-gray-600">{course.categoryName}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="flex items-center text-amber-500">
                        <i className="fas fa-star mr-1"></i>
                        <span>4.8</span>
                        <span className="text-gray-500 ml-1">(2)</span>
                        {/* <span className="text-gray-500 ml-1">({Math.floor(Math.random() * 1000) + 500})</span> */}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description || 'No description available.'}</p>
                    <div className="flex items-center mb-4">
                      <Image
                        src={course.instructorImage || '/default.jpg'}
                        alt={course.instructorName}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-600">{course.instructorName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lime-600 font-bold">
                        {course.price ? `$${course.price.toFixed(2)}` : 'Free'}
                      </span>
                      <Link
                        href={`/courses/${course._id}`}
                        className="bg-lime-100 hover:bg-lime-200 text-lime-600 px-3 py-1 rounded-full text-sm transition duration-150 ease-in-out"
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}