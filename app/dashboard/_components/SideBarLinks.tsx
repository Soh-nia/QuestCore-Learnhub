'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiBookOpen } from 'react-icons/fi';
import classnames from 'classnames';
import { ComponentType, SVGProps } from 'react';

// Define route interface for TypeScript
interface Route {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
}

export const instructorRoutes: Route[] = [
  { icon: FiHome, label: 'Overview', href: '/dashboard/instructor' },
  { icon: FiBookOpen, label: 'Courses', href: '/dashboard/instructor/courses' },
];

export const studentRoutes: Route[] = [
  { icon: FiHome, label: 'Analytics', href: '/dashboard/student' },
  { icon: FiBookOpen, label: 'Courses', href: '/dashboard/student/courses' },
];

const SideBarLinks = () => {
  const currentPath = usePathname();
  const isInstructorPage = currentPath?.startsWith('/dashboard/instructor');
  const routes = isInstructorPage ? instructorRoutes : studentRoutes;

  return (
    <ul className="flex flex-col space-y-3">
      {routes.map((route) => {
        // const isActive = currentPath === route.href;
        const isActive =
            route.href === '/dashboard/instructor' || route.href === '/dashboard/student'
                ? currentPath === route.href
                : currentPath?.startsWith(route.href);
                    const Icon = route.icon;

        return (
          <li key={route.href}>
            <Link
              href={route.href}
              aria-current={isActive ? 'page' : undefined}
              className={classnames(
                'flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg',
                {
                  'bg-gray-200 text-gray-900 font-medium border-e-4 dark:bg-neutral-700 border-e-lime-600': isActive,
                  'text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700': !isActive,
                }
              )}
            >
              <Icon className="shrink-0 size-4" height={24} width={24} />
              {route.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SideBarLinks;