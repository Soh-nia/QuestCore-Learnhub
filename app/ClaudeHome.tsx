import React from 'react'
import Image from "next/image";

const ClaudeHome = () => {
  return (
    <>
    <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
                <div className="flex items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <span className="text-indigo-600 font-bold text-2xl">LearnHub</span>
                    </div>
                    <div className="hidden md:ml-10 md:flex md:space-x-8">
                        <a href="#" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Home</a>
                        <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Courses</a>
                        <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Programs</a>
                        <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Enterprise</a>
                        <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">For Teachers</a>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Log in</a>
                        <a href="#" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">Sign up</a>
                    </div>
                    <div className="flex items-center md:hidden">
                        <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
                            <i className="fas fa-bars"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <div className="hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-white">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">Unlock your potential with online learning</h1>
                    <p className="mt-4 text-lg md:text-xl text-indigo-100">Discover thousands of courses taught by industry experts and unlock new opportunities with hands-on projects.</p>
                    <div className="mt-8 space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
                        <a href="#" className="block bg-white text-indigo-600 hover:bg-gray-100 font-medium px-6 py-3 rounded-lg shadow-md text-center transition duration-150 ease-in-out">Get Started</a>
                        <a href="#" className="block border border-white text-white hover:bg-indigo-700 font-medium px-6 py-3 rounded-lg text-center transition duration-150 ease-in-out">Explore Courses</a>
                    </div>
                </div>
                <div className="hidden md:block">
                    <Image width={600} height={500} src="/api/placeholder/600/400" alt="Students learning online" className="rounded-lg shadow-xl" />
                </div>
            </div>
        </div>
    </div>

    <div className="bg-white shadow-md rounded-lg mx-4 sm:mx-auto max-w-3xl -mt-10 relative z-10">
        <div className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow">
                    <input type="text" placeholder="What do you want to learn?" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition duration-150 ease-in-out">Search</button>
            </div>
        </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Browse top categories</h2>
            <p className="mt-4 text-lg text-gray-600">Explore our most popular learning paths and skill categories</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <a href="#" className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-150 ease-in-out">
                <div className="w-14 h-14 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mb-4">
                    <i className="fas fa-laptop-code text-xl"></i>
                </div>
                <span className="text-sm font-medium text-center">Programming</span>
            </a>
            <a href="#" className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-150 ease-in-out">
                <div className="w-14 h-14 flex items-center justify-center bg-green-100 text-green-600 rounded-full mb-4">
                    <i className="fas fa-chart-line text-xl"></i>
                </div>
                <span className="text-sm font-medium text-center">Business</span>
            </a>
            <a href="#" className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-150 ease-in-out">
                <div className="w-14 h-14 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full mb-4">
                    <i className="fas fa-paint-brush text-xl"></i>
                </div>
                <span className="text-sm font-medium text-center">Design</span>
            </a>
            <a href="#" className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-150 ease-in-out">
                <div className="w-14 h-14 flex items-center justify-center bg-red-100 text-red-600 rounded-full mb-4">
                    <i className="fas fa-camera text-xl"></i>
                </div>
                <span className="text-sm font-medium text-center">Photography</span>
            </a>
            <a href="#" className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-150 ease-in-out">
                <div className="w-14 h-14 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-full mb-4">
                    <i className="fas fa-language text-xl"></i>
                </div>
                <span className="text-sm font-medium text-center">Languages</span>
            </a>
            <a href="#" className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-150 ease-in-out">
                <div className="w-14 h-14 flex items-center justify-center bg-pink-100 text-pink-600 rounded-full mb-4">
                    <i className="fas fa-heartbeat text-xl"></i>
                </div>
                <span className="text-sm font-medium text-center">Health</span>
            </a>
        </div>
    </div>

    <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
                <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">View all courses</a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 card-hover">
                    <div className="relative">
                        <Image width={600} height={500} src="/api/placeholder/400/200" alt="Course thumbnail" className="w-full h-48 object-cover" />
                        <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">BESTSELLER</div>
                    </div>
                    <div className="p-5">
                        <div className="flex items-center text-sm mb-2">
                            <span className="text-gray-600">Programming</span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="flex items-center text-amber-500">
                                <i className="fas fa-star mr-1"></i>
                                <span>4.8</span>
                                <span className="text-gray-500 ml-1">(2.5k)</span>
                            </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">The Complete Web Development Bootcamp 2025</h3>
                        <p className="text-gray-600 text-sm mb-4">Learn HTML, CSS, JavaScript, React, Node and more with practical projects.</p>
                        <div className="flex items-center justify-between">
                            <span className="text-indigo-600 font-bold">$89.99</span>
                            <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-600 px-3 py-1 rounded-full text-sm transition duration-150 ease-in-out">Add to cart</button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 card-hover">
                    <div className="relative">
                        <Image width={600} height={500} src="/api/placeholder/400/200" alt="Course thumbnail" className="w-full h-48 object-cover" />
                        <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">NEW</div>
                    </div>
                    <div className="p-5">
                        <div className="flex items-center text-sm mb-2">
                            <span className="text-gray-600">Business</span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="flex items-center text-amber-500">
                                <i className="fas fa-star mr-1"></i>
                                <span>4.7</span>
                                <span className="text-gray-500 ml-1">(1.2k)</span>
                            </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">Digital Marketing Mastery: SEO, Social Media & More</h3>
                        <p className="text-gray-600 text-sm mb-4">Master digital marketing strategies that drive business growth.</p>
                        <div className="flex items-center justify-between">
                            <span className="text-indigo-600 font-bold">$69.99</span>
                            <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-600 px-3 py-1 rounded-full text-sm transition duration-150 ease-in-out">Add to cart</button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 card-hover">
                    <div className="relative">
                        <Image width={600} height={500} src="/api/placeholder/400/200" alt="Course thumbnail" className="w-full h-48 object-cover" />
                    </div>
                    <div className="p-5">
                        <div className="flex items-center text-sm mb-2">
                            <span className="text-gray-600">Design</span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="flex items-center text-amber-500">
                                <i className="fas fa-star mr-1"></i>
                                <span>4.9</span>
                                <span className="text-gray-500 ml-1">(3.1k)</span>
                            </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">UI/UX Design: Create Beautiful User Experiences</h3>
                        <p className="text-gray-600 text-sm mb-4">Learn UI/UX principles and create stunning designs with Figma.</p>
                        <div className="flex items-center justify-between">
                            <span className="text-indigo-600 font-bold">$79.99</span>
                            <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-600 px-3 py-1 rounded-full text-sm transition duration-150 ease-in-out">Add to cart</button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 card-hover">
                    <div className="relative">
                        <Image width={600} height={500} src="/api/placeholder/400/200" alt="Course thumbnail" className="w-full h-48 object-cover" />
                    </div>
                    <div className="p-5">
                        <div className="flex items-center text-sm mb-2">
                            <span className="text-gray-600">Personal Development</span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="flex items-center text-amber-500">
                                <i className="fas fa-star mr-1"></i>
                                <span>4.6</span>
                                <span className="text-gray-500 ml-1">(980)</span>
                            </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">Productivity Masterclass: Time Management for Success</h3>
                        <p className="text-gray-600 text-sm mb-4">Learn strategies to maximize productivity and achieve more in less time.</p>
                        <div className="flex items-center justify-between">
                            <span className="text-indigo-600 font-bold">$49.99</span>
                            <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-600 px-3 py-1 rounded-full text-sm transition duration-150 ease-in-out">Add to cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why choose LearnHub?</h2>
            <p className="mt-4 text-lg text-gray-600">Join millions of learners from around the world</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-4">
                    <i className="fas fa-award text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-2">Learn from experts</h3>
                <p className="text-gray-600">Access courses taught by industry leaders and academic experts with real-world experience.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-4">
                    <i className="fas fa-clock text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-2">Learn at your own pace</h3>
                <p className="text-gray-600">Study whenever and wherever it fits your schedule with lifetime access to courses.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-4">
                    <i className="fas fa-certificate text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-2">Earn certificates</h3>
                <p className="text-gray-600">Add industry-recognized credentials to your resume and share them with your network.</p>
            </div>
        </div>
    </div>

    <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">What our students say</h2>
                <p className="mt-4 text-lg text-gray-600">Join over 10 million students worldwide</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <div className="text-amber-500 flex">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                        </div>
                    </div>
                    <p className="text-gray-600 mb-4">The web development course completely changed my career path. I went from knowing nothing about coding to landing a job as a junior developer in just 6 months.</p>
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                        <div>
                            <h4 className="font-medium">Michael T.</h4>
                            <p className="text-sm text-gray-500">Web Developer</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <div className="text-amber-500 flex">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                        </div>
                    </div>
                    <p className="text-gray-600 mb-4">The UI/UX design course was incredibly comprehensive and practical. The instructors feedback was invaluable and helped me build a strong portfolio.</p>
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                        <div>
                            <h4 className="font-medium">Sarah J.</h4>
                            <p className="text-sm text-gray-500">UX Designer</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <div className="text-amber-500 flex">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star-half-alt"></i>
                        </div>
                    </div>
                    <p className="text-gray-600 mb-4">Ive taken several business courses on LearnHub and theyve all been excellent. The content is up-to-date and the community support is amazing.</p>
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                        <div>
                            <h4 className="font-medium">David R.</h4>
                            <p className="text-sm text-gray-500">Business Owner</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className="bg-indigo-600 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to start learning?</h2>
            <p className="text-xl text-indigo-100 mb-8">Join our community of over 10 million learners and advance your career today.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="#" className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out">Get Started For Free</a>
                <a href="#" className="px-8 py-4 border border-white text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-150 ease-in-out">Try Business Plan</a>
            </div>
        </div>
    </div>

    <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4">LearnHub</h3>
                    <p className="text-gray-400 mb-4">Empowering learners worldwide with quality education and skills for the future.</p>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram"></i></a>
                        <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Courses</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-white">Web Development</a></li>
                        <li><a href="#" className="hover:text-white">Data Science</a></li>
                        <li><a href="#" className="hover:text-white">Business</a></li>
                        <li><a href="#" className="hover:text-white">Design</a></li>
                        <li><a href="#" className="hover:text-white">Marketing</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Company</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-white">About Us</a></li>
                        <li><a href="#" className="hover:text-white">Careers</a></li>
                        <li><a href="#" className="hover:text-white">Blog</a></li>
                        <li><a href="#" className="hover:text-white">Partners</a></li>
                        <li><a href="#" className="hover:text-white">Contact Us</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Support</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-white">Help Center</a></li>
                        <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-white">Accessibility</a></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
                <p>&copy; 2025 LearnHub. All rights reserved.</p>
            </div>
        </div>
    </footer>
    </>
  )
}

export default ClaudeHome
