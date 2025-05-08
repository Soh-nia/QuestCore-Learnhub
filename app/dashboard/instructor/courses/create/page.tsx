import { auth } from "@/auth"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { Suspense } from "react"
import CreateForm from "./CreateForm"
import { Skeleton } from "@/app/_components/Skeleton"

export const metadata: Metadata = {
  title: "Create Course",
  description: "Create a course",
}

export const dynamic = "force-dynamic";

// Loading fallback component
function CreateFormSkeleton() {
  return (
    <div className="text-center">
      <h3 className="text-4xl sm:text-4xl font-bold text-gray-800 dark:text-neutral-200">Name Your Course</h3>
      <p className="mt-3 text-gray-600 dark:text-neutral-400">
        What would you like to name your course? Don&apos;t worry you can change this later.
      </p>
      <div className="mt-5 sm:mt-10 mx-auto max-w-xl relative">
        <div className="relative z-10 flex gap-x-3 p-3 bg-white border border-gray-200 rounded-lg shadow-lg shadow-gray-100 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-gray-900/20">
          <div className="w-full">
            <Skeleton className="py-2.5 px-4 w-full h-10 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-10">
        <Skeleton className="m-1 py-3 px-4 inline-block w-24 h-10 rounded-lg" />
        <Skeleton className="m-1 py-3 px-4 inline-block w-24 h-10 rounded-lg" />
      </div>
    </div>
  )
}

export default async function CreateCourse() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  if (session.user.role !== "instructor") {
    redirect("/dashboard")
  }

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-24">
        <Suspense fallback={<CreateFormSkeleton />}>
          <CreateForm />
        </Suspense>
      </div>
    </div>
  )
}
