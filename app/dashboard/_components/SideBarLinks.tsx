"use client"

import { usePathname } from "next/navigation"
import { FiHome, FiBookOpen } from "react-icons/fi"
import classnames from "classnames"
import { type ComponentType, type SVGProps, useEffect, useState } from "react"
import { PiStudentBold } from "react-icons/pi"
import { GrCertificate } from "react-icons/gr"
import { useSession } from "next-auth/react"
import LinkWithProgress from "@/app/_components/link-with-progress"

// Define route interface for TypeScript
interface Route {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  href: string
}

export const instructorRoutes: Route[] = [
  { icon: FiHome, label: "Overview", href: "/dashboard/instructor" },
  { icon: FiBookOpen, label: "Courses", href: "/dashboard/instructor/courses" },
  { icon: PiStudentBold, label: "Enrollments", href: "/dashboard/instructor/enrollments" },
]

export const studentRoutes: Route[] = [
  { icon: FiHome, label: "Analytics", href: "/dashboard/student" },
  { icon: FiBookOpen, label: "Courses", href: "/dashboard/student/courses" },
  { icon: GrCertificate, label: "Certificates", href: "/dashboard/student/certificates" },
]

const SideBarLinks = () => {
  const { data: session, status } = useSession()
  const currentPath = usePathname()
  const [routes, setRoutes] = useState<Route[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Determine routes based on user role from session
  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true)
      return
    }

    const userRole = session?.user?.role

    if (userRole === "instructor") {
      setRoutes(instructorRoutes)
    } else if (userRole === "student") {
      setRoutes(studentRoutes)
    } else {
      // Fallback to path-based determination if role is not available
      const isInstructorPath = currentPath?.startsWith("/dashboard/instructor")
      setRoutes(isInstructorPath ? instructorRoutes : studentRoutes)
    }

    setIsLoading(false)
  }, [session, status, currentPath])

  if (isLoading) {
    return (
      <ul className="flex flex-col space-y-3">
        {[1, 2, 3].map((i) => (
          <li key={i} className="animate-pulse">
            <div className="flex items-center gap-x-3.5 py-2 px-2.5">
              <div className="h-4 w-4 bg-gray-200 rounded dark:bg-neutral-700"></div>
              <div className="h-4 w-24 bg-gray-200 rounded dark:bg-neutral-700"></div>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className="flex flex-col space-y-3">
      {routes.map((route) => {
        const isActive =
          route.href === "/dashboard/instructor" || route.href === "/dashboard/student"
            ? currentPath === route.href
            : currentPath?.startsWith(route.href)
        const Icon = route.icon

        return (
          <li key={route.href}>
            <LinkWithProgress
              href={route.href}
              aria-current={isActive ? "page" : undefined}
              className={classnames("flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg", {
                "bg-gray-200 text-gray-900 font-medium border-e-4 dark:bg-neutral-700 border-e-lime-600": isActive,
                "text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700": !isActive,
              })}
            >
              <Icon className="shrink-0 size-4" height={24} width={24} />
              {route.label}
            </LinkWithProgress>
          </li>
        )
      })}
    </ul>
  )
}

export default SideBarLinks