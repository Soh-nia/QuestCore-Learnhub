"use client"

import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

// Define interfaces
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

export default function DashboardChartsOptimized({
  courses,
  enrollments,
}: {
  courses: LeanCourse[]
  enrollments: Enrollment[]
}) {
  const displayLimit = 10
  const limitedCourses = courses.slice(0, displayLimit)

  // Prepare data for bar chart (enrollments per course)
  const courseTitles = limitedCourses.map((course) => course.title)
  const enrollmentCounts = limitedCourses.map(
    (course) => enrollments.filter((e) => e.course.title === course.title).length,
  )

  const barData = {
    labels: courseTitles,
    datasets: [
      {
        label: "Enrollments",
        data: enrollmentCounts,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Prepare data for line chart (revenue over time)
  const revenueByMonth = enrollments.reduce(
    (acc, enrollment) => {
      if (!enrollment.course.price) return acc
      const month = new Date().toLocaleString("default", { month: "short", year: "numeric" })
      acc[month] = (acc[month] || 0) + enrollment.course.price
      return acc
    },
    {} as Record<string, number>,
  )

  const months = Object.keys(revenueByMonth)
  const revenues = Object.values(revenueByMonth)

  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Revenue ($)",
        data: revenues,
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        fill: true,
      },
    ],
  }

  // Optimize chart options for better performance
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    plugins: {
      legend: { position: "top" as const },
      tooltip: {
        enabled: true,
        mode: "index" as const,
        intersect: false,
      },
    },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Enrollments per Course</h3>
        <div className="h-[300px]">
          <Bar
            data={barData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: { display: true, text: "Course Enrollments" },
              },
            }}
          />
        </div>
      </div>
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Revenue Over Time</h3>
        <div className="h-[300px]">
          <Line
            data={lineData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: { display: true, text: "Monthly Revenue" },
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
