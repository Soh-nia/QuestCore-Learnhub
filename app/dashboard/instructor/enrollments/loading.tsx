import EnrollmentTableSkeleton from "@/app/_components/EnrollmentTableSkeleton"

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Course Enrollments</h1>
        <EnrollmentTableSkeleton />
      </div>
    </main>
  )
}
