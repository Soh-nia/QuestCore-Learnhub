"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/app/_components/Skeleton"

const DynamicCharts = dynamic(() => import("./DashboardCharts"), {
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Enrollments per Course</h3>
        <Skeleton className="w-full h-[300px]" />
      </div>
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Revenue Over Time</h3>
        <Skeleton className="w-full h-[300px]" />
      </div>
    </div>
  ),
  ssr: false,
})

// Interface definitions
interface LeanCourse {
  _id: string
  title: string
  price: number | null
  isPublished: boolean
  createdAt: Date
}

interface Enrollment {
  course: {
    title: string
    price: number | null
  }
  student: {
    name: string
    image: string
  }
}

export default function OptimizedCharts({
  courses,
  enrollments,
}: {
  courses: LeanCourse[]
  enrollments: Enrollment[]
}) {
  // Use state to defer chart rendering until after hydration
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Enrollments per Course</h3>
          <Skeleton className="w-full h-[300px]" />
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Revenue Over Time</h3>
          <Skeleton className="w-full h-[300px]" />
        </div>
      </div>
    )
  }

  return <DynamicCharts courses={courses} enrollments={enrollments} />
}
