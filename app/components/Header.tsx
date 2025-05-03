'use client';

import React from 'react';
import { Logo } from './Logo';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';


const Header = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (href: string) => {
    return href === '/' ? pathname === href : pathname.startsWith(href);
  };

  // const handleSignOut = async () => {
  //   await signOut({ callbackUrl: '/' });
  // };

  return (
    <header className="flex flex-wrap lg:justify-start lg:flex-nowrap z-50 w-full py-3">
      <nav className="relative max-w-7xl w-full flex flex-wrap lg:grid lg:grid-cols-12 basis-full items-center px-4 md:px-6 lg:px-8 mx-auto">
        <div className="lg:col-span-3 flex items-center">
          <Logo />
          <div className="ms-1 sm:ms-2"></div>
        </div>

        <div className="flex items-center gap-x-1 lg:gap-x-2 ms-auto py-1 lg:ps-6 lg:order-3 lg:col-span-3">
          <div className="hs-dropdown p-2">
            <button
              id="hs-dropdown-dark-mode"
              type="button"
              className="hs-dropdown-toggle hs-dark-mode group flex items-center text-gray-600 hover:text-cyan-600 focus:outline-hidden focus:text-cyan-600 font-medium dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              <svg
                className="hs-dark-mode-active:hidden block size-4"
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
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </svg>
              <svg
                className="hs-dark-mode-active:block hidden size-4"
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
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </svg>
            </button>

            <div
              id="selectThemeDropdown"
              className="hs-dropdown-menu hs-dropdown-open:opacity-100 mt-2 hidden z-10 transition-[margin,opacity] opacity-0 duration-300 mb-2 origin-bottom-left bg-white shadow-md rounded-lg p-1 space-y-0.5 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="hs-dropdown-dark-mode"
            >
              <button
                type="button"
                className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300"
                data-hs-theme-click-value="default"
              >
                Light
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300"
                data-hs-theme-click-value="dark"
              >
                Dark
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300"
                data-hs-theme-click-value="auto"
              >
                Auto (System)
              </button>
            </div>
          </div>
          {/* User Dropdown or Sign In Button */}
          {status === 'authenticated' ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-x-3.5 py-2 px-3 text-sm font-medium rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
            >
              <Image
                  className="w-8 h-8 rounded-full"
                  src={session?.user?.image ?? '/default.png'}
                  width={32}
                  height={32}
                  alt="User avatar"
              />
            </Link>
            // <div className="hs-dropdown p-2">
            //   <button
            //     id="hs-dropdown-custom-trigger"
            //     type="button"
            //     className="hs-dropdown-toggle inline-flex items-center gap-x-2 text-sm font-medium rounded-full bg-white text-gray-800 dark:bg-neutral-700 dark:text-white"
            //     aria-haspopup="menu"
            //     aria-expanded="false"
            //     aria-label="User menu"
            //   >
            //     <Image
            //       className="w-8 h-8 rounded-full"
            //       src={session?.user?.image ?? '/default.png'}
            //       width={32}
            //       height={32}
            //       alt="User avatar"
            //     />
            //     <svg
            //       className="hs-dropdown-open:rotate-180 size-4"
            //       xmlns="http://www.w3.org/2000/svg"
            //       width="24"
            //       height="24"
            //       viewBox="0 0 24 24"
            //       fill="none"
            //       stroke="currentColor"
            //       strokeWidth="2"
            //       strokeLinecap="round"
            //       strokeLinejoin="round"
            //     >
            //       <path d="m6 9 6 6 6-6" />
            //     </svg>
            //   </button>

            //   <div
            //     className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-48 bg-white shadow-md rounded-lg mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700"
            //     role="menu"
            //     aria-orientation="vertical"
            //     aria-labelledby="hs-dropdown-custom-trigger"
            //   >
            //     <div className="p-1">
            //       <Link
            //         href="/dashboard"
            //         className="flex items-center gap-x-3.5 py-2 px-3 text-sm font-medium rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
            //       >
            //         <svg
            //           className="shrink-0 size-4"
            //           xmlns="http://www.w3.org/2000/svg"
            //           width="24"
            //           height="24"
            //           viewBox="0 0 24 24"
            //           fill="none"
            //           stroke="currentColor"
            //           strokeWidth="2"
            //           strokeLinecap="round"
            //           strokeLinejoin="round"
            //         >
            //           <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            //           <path d="M3 9h18" />
            //           <path d="M9 21V9" />
            //         </svg>
            //         Dashboard
            //       </Link>
            //       <button
            //         onClick={handleSignOut}
            //         className="w-full flex items-center gap-x-3.5 py-2 px-3 text-sm font-medium rounded-lg text-gray-800 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:bg-red-100 dark:text-neutral-400 dark:hover:bg-red-900 dark:hover:text-red-200 dark:focus:bg-red-900"
            //       >
            //         <svg
            //           className="shrink-0 size-4"
            //           xmlns="http://www.w3.org/2000/svg"
            //           width="24"
            //           height="24"
            //           viewBox="0 0 24 24"
            //           fill="none"
            //           stroke="currentColor"
            //           strokeWidth="2"
            //           strokeLinecap="round"
            //           strokeLinejoin="round"
            //         >
            //           <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            //           <polyline points="16 17 21 12 16 7" />
            //           <line x1="21" x2="9" y1="12" y2="12" />
            //         </svg>
            //         Sign Out
            //       </button>
            //     </div>
            //   </div>
            // </div>
          ) : (
            <Link
              href="/auth/signin"
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-bold text-nowrap rounded-xl border border-transparent bg-lime-500 text-gray-800 hover:bg-lime-600 focus:outline-none focus:bg-lime-600 transition disabled:opacity-50 disabled:pointer-events-none"
            >
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
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Sign in
            </Link>
          )}

          <div className="lg:hidden">
            <button
              type="button"
              className="hs-collapse-toggle size-9.5 flex justify-center items-center text-sm font-semibold rounded-xl border border-gray-200 text-black hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              id="hs-navbar-hcail-collapse"
              aria-expanded="false"
              aria-controls="hs-navbar-hcail"
              aria-label="Toggle navigation"
              data-hs-collapse="#hs-navbar-hcail"
            >
              <svg
                className="hs-collapse-open:hidden shrink-0 size-4"
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
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="3" x2="21" y1="12" y2="12" />
                <line x1="3" x2="21" y1="18" y2="18" />
              </svg>
              <svg
                className="hs-collapse-open:block hidden shrink-0 size-4"
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div
          id="hs-navbar-hcail"
          className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow lg:block lg:w-auto lg:basis-auto lg:order-2 lg:col-span-6"
          aria-labelledby="hs-navbar-hcail-collapse"
        >
          <div className="flex flex-col gap-y-4 gap-x-0 mt-5 lg:flex-row lg:justify-center lg:items-center lg:gap-y-0 lg:gap-x-7 lg:mt-0">
            <div>
              <Link
                className={`relative inline-block focus:outline-hidden ${
                  isActive('/')
                    ? 'text-black before:absolute before:bottom-0.5 before:start-0 before:-z-1 before:w-full before:h-1 before:bg-lime-500 dark:text-white'
                    : 'text-black hover:text-gray-600 dark:text-white dark:hover:text-neutral-300'
                }`}
                href="/"
              >
                Home
              </Link>
            </div>
            <div>
              <Link
                className={`relative inline-block focus:outline-hidden ${
                  isActive('/courses')
                    ? 'text-black before:absolute before:bottom-0.5 before:start-0 before:-z-1 before:w-full before:h-1 before:bg-lime-500 dark:text-white'
                    : 'text-black hover:text-gray-600 dark:text-white dark:hover:text-neutral-300'
                }`}
                href="/courses"
              >
                Courses
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;