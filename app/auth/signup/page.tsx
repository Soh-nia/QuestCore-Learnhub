import Footer from '@/app/_components/Footer'
import Header from '@/app/_components/Header'
import { Lusitana } from 'next/font/google';
import Link from 'next/link';
import { HiUserGroup } from "react-icons/hi";
import { GiBookmarklet } from "react-icons/gi";

const lusitana = Lusitana({ subsets: ['latin'], weight: ['400', '700'], });

export const dynamic = "force-dynamic";

const SignUp = () => {
  return (
    <div className="overflow-hidden">
        <Header />
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto dark:bg-neutral-900">
            <div className="mx-auto max-w-2xl mb-8 lg:mb-14 text-center">
                <h2 className="text-3xl lg:text-4xl text-gray-800 font-bold dark:text-neutral-200">
                Join <span className={`text-5xl font-bold text-lime-500 ${lusitana.className}`} >QuestCore</span> Today! We’ve got you covered.
                </h2>
            </div>

            <div className="relative xl:w-10/12 xl:mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <div className="shadow-sm p-4 relative z-10 bg-white border border-gray-200 rounded-xl md:p-10 dark:bg-neutral-900 dark:border-neutral-800">
                        <div className="flex items-center gap-x-4">
                            <HiUserGroup className="w-12 h-12 text-lime-600 dark:text-lime-500" />
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-800 dark:text-neutral-200">
                                    Sign Up as an Instructor
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-neutral-400">
                                    Empower learners worldwide with your expertise
                                </p>
                            </div>
                        </div>
                        <p className="mt-5 text-gray-600 dark:text-neutral-400">
                            Create and manage courses, share your knowledge, and inspire students globally. As an instructor, you’ll have access to powerful tools to build engaging content and grow your audience.
                        </p>
                        <ul className="mt-5 space-y-2 text-base text-gray-600 dark:text-neutral-200">
                            <li className="flex gap-x-3">
                                <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-lime-600 dark:bg-lime-800/30 dark:text-lime-500">
                                    <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                </span>
                            Design courses with interactive quizzes and videos
                            </li>
                            <li className="flex gap-x-3">
                            <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-lime-600 dark:bg-lime-800/30 dark:text-lime-500">
                                <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </span>
                            Track student progress and provide feedback
                            </li>
                            <li className="flex gap-x-3">
                            <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-lime-600 dark:bg-lime-800/30 dark:text-lime-500">
                                <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </span>
                            Earn revenue from your courses
                            </li>
                        </ul>
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-500 dark:text-neutral-200">
                            <span className="font-medium">Join 10,000+ instructors</span> teaching
                            </div>
                            <Link href="/auth/signup/instructor">
                                <button className="inline-flex items-center gap-x-2 px-6 py-3 text-white bg-cyan-600 rounded-lg hover:bg-lime-700 focus:outline-hidden focus:bg-cyan-700 dark:bg-lime-500 dark:hover:bg-cyan-600 dark:focus:bg-cyan-600">
                                    Become an Instructor
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="shadow-xl shadow-gray-200 p-5 relative z-10 bg-white border border-gray-200 rounded-xl md:p-10 dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-gray-900/20">
                        <div className="flex items-center gap-x-4">
                            <GiBookmarklet className="w-12 h-12 text-lime-600 dark:text-lime-500" />
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-800 dark:text-neutral-200">
                                    Sign Up as a Student
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-neutral-400">
                                    Learn new skills at your own pace
                                </p>
                            </div>
                        </div>
                        <p className="mt-5 text-gray-600 dark:text-neutral-400">
                            Enroll in courses, track your progress, and acquire skills to advance your career or personal growth. Explore a vast library of courses tailored to your interests.
                        </p>
                        <ul className="mt-5 space-y-2 text-base text-gray-600 dark:text-neutral-200">
                            <li className="flex gap-x-3">
                                <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-lime-600 dark:bg-lime-800/30 dark:text-lime-500">
                                    <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                </span>
                                Access thousands of courses across industries
                            </li>
                            <li className="flex gap-x-3">
                            <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-lime-600 dark:bg-lime-800/30 dark:text-lime-500">
                                <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </span>
                            Learn on-demand with flexible scheduling
                            </li>
                            <li className="flex gap-x-3">
                            <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-lime-600 dark:bg-lime-800/30 dark:text-lime-500">
                                <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </span>
                            Earn certificates to showcase your skills
                            </li>
                        </ul>
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-500 dark:text-neutral-400">
                                <span className="font-medium">Over 1M students</span> learning daily
                            </div>
                            <Link href="/auth/signup/student">
                                <button className="inline-flex items-center gap-x-2 px-6 py-3 text-white bg-cyan-600 rounded-lg hover:bg-lime-700 focus:outline-hidden focus:bg-cyan-700 dark:bg-lime-500 dark:hover:bg-cyan-600 dark:focus:bg-cyan-600">
                                Start Learning
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 dark:text-neutral-400">
                    Already have an account?{' '}
                    <Link href="/auth/signin">
                        <button className="inline-flex items-center px-4 py-2 text-lime-600 border border-lime-600 rounded-lg hover:bg-blue-50 focus:outline-hidden focus:bg-blue-50 dark:text-lime-500 dark:border-lime-500 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                        Sign In
                        </button>
                    </Link>
                    </p>
                </div>

                <div className="hidden md:block absolute top-0 end-0 translate-y-16 translate-x-16">
                    <svg className="w-16 h-auto text-lime-500" width="121" height="135" viewBox="0 0 121 135" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
                    <path d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
                    <path d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
                    </svg>
                </div>

                <div className="hidden md:block absolute bottom-0 start-0 translate-y-16 -translate-x-16">
                    <svg className="w-56 h-auto text-cyan-500" width="347" height="188" viewBox="0 0 347 188" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/>
                    </svg>
                </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default SignUp
