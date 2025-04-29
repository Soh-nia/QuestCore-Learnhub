'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import SideBarLinks, { instructorRoutes, studentRoutes } from './SideBarLinks';
import { SideBarLogo } from '@/app/components/Logo';

// Breadcrumb Component
const Breadcrumb = () => {
  const currentPath = usePathname();
  const isInstructorPage = currentPath?.startsWith('/dashboard/instructor');
  const routes = isInstructorPage ? instructorRoutes : studentRoutes;

  const pathSegments = currentPath?.split('/').filter((segment) => segment) || [];

  const breadcrumbItems: { label: string; href: string | null }[] = [
    {
      label: 'Dashboard',
      href: `/dashboard/${isInstructorPage ? 'instructor' : 'student'}`,
    },
  ];

  const matchedRoute = routes
    .filter((route) => currentPath.startsWith(route.href))
    .sort((a, b) => b.href.length - a.href.length)[0];

  if (matchedRoute) {
    breadcrumbItems.push({
      label: matchedRoute.label,
      href: matchedRoute.href,
    });
  }

  // Handle additional segments (e.g., course ID or subpage)
  if (pathSegments.length > 3) {
    const extraSegment = pathSegments[pathSegments.length - 1];
    breadcrumbItems.push({
      label: extraSegment.charAt(0).toUpperCase() + extraSegment.slice(1),
      href: null,
    });
  } else if (pathSegments.length === 3 && matchedRoute) {
    breadcrumbItems[breadcrumbItems.length - 1].href = null;
  }

  return (
    <ol className="ms-3 flex items-center whitespace-nowrap">
      {breadcrumbItems.map((item, index) => (
        <li
          key={item.label}
          className="flex items-center text-sm text-gray-800 dark:text-neutral-400"
          aria-current={index === breadcrumbItems.length - 1 ? 'page' : undefined}
        >
          {item.href ? (
            <Link href={item.href} className="hover:text-blue-600 dark:hover:text-blue-400">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold truncate">{item.label}</span>
          )}
          {index < breadcrumbItems.length - 1 && (
            <svg
              className="shrink-0 mx-3 overflow-visible size-2.5 text-gray-400 dark:text-neutral-500"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </li>
      ))}
    </ol>
  );
};

const SideBar = () => {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      window.location.href = '/auth/signin';
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  useEffect(() => {
    import('preline/preline').then(({ HSOverlay }) => {
      const sidebar = document.querySelector('#hs-application-sidebar');
      if (sidebar) {
        HSOverlay.autoInit();
      }
    });
  }, []);

  return (
    <>
      <div className="-mt-px">
        <div className="sticky top-0 inset-x-0 z-20 bg-white border-y border-gray-200 px-4 sm:px-6 lg:px-8 lg:hidden dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-center py-2">
            {/* Navigation Toggle */}
            <button
              type="button"
              className="size-8 flex justify-center items-center gap-x-2 border border-gray-200 text-gray-800 hover:text-gray-500 rounded-lg focus:outline-none focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="hs-application-sidebar"
              aria-label="Toggle navigation"
              data-hs-overlay="#hs-application-sidebar"
            >
              <span className="sr-only">Toggle Navigation</span>
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
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M15 3v18" />
                <path d="m8 9 3 3-3 3" />
              </svg>
            </button>

            {/* Breadcrumb */}
            <Breadcrumb />
          </div>
        </div>
      </div>

      <div
        id="hs-application-sidebar"
        className="hs-overlay [--auto-close:lg] [--overlay-backdrop:false] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform w-64 h-full fixed inset-y-0 start-0 zに来60 bg-white border-e border-gray-200 lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 dark:bg-neutral-800 dark:border-neutral-700"
        role="dialog"
        tabIndex={-1}
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col h-full">
          {/* Logo Section */}
          <SideBarLogo />

          <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <nav className="hs-accordion-group p-3 w-full flex flex-col h-full">
              <SideBarLinks />

              {/* Spacer to push Sign Out button to the bottom */}
              <div className="flex-grow" />

              {/* Sign Out Button */}
              <div className="hs-dropdown py-2 border-t border-gray-200 dark:border-neutral-700">
                <button
                  id="hs-dropdown-custom-trigger"
                  type="button"
                  className="hs-dropdown-toggle py-2 px-3 inline-flex items-center gap-x-4 text-base font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  aria-label="User menu"
                >
                  <Image
                    className="w-10 h-auto rounded-full"
                    src={session?.user?.image ?? '/default.png'}
                    width={30}
                    height={30}
                    alt="User avatar"
                  />
                  <div className="flex flex-col">
                    <span className="text-gray-600 font-medium truncate max-w-30 dark:text-neutral-400">
                      {session?.user?.name}
                    </span>
                    <span className="text-gray-600 truncate max-w-30 dark:text-neutral-400 text-sm">
                      {session?.user?.email}
                    </span>
                  </div>
                  <svg
                    className="hs-dropdown-open:rotate-180 size-4"
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
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                <div
                  className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="hs-dropdown-custom-trigger"
                >
                  <div className="p-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium rounded-lg text-gray-800 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:bg-red-100 dark:text-neutral-400 dark:hover:bg-red-900 dark:hover:text-red-200 dark:focus:bg-red-900"
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
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" x2="9" y1="12" y2="12" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;