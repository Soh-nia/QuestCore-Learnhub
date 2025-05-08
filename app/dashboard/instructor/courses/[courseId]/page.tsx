import { redirect } from "next/navigation"
import { auth } from "@/auth"
import type { Metadata } from "next"
import { Suspense } from "react"
import { unstable_cache } from "next/cache"
import connectMongoose from "@/lib/mongoose-connect"
import Course from "@/models/Course"
import User from "@/models/User"
import Category from "@/models/Category"
import { RiApps2AiLine } from "react-icons/ri"
import { FaListCheck, FaDollarSign, FaRegFile } from "react-icons/fa6"
import TitleForm from "./_components/TitleForm"
import DescriptionForm from "./_components/DescriptionForm"
import ImageForm from "./_components/ImageForm"
import CategoryForm from "./_components/CategoryForm"
import PriceForm from "./_components/PriceForm"
import AttachmentForm from "./_components/AttachmentForm"
import type { CourseI } from "@/types/course"
import ChapterForm from "./_components/ChapterForm"
import AlertBanner from "@/app/_components/AlertBanner"
import CourseAction from "./_components/CourseAction"
import Attachment from "@/models/Attachment"
import Chapter from "@/models/Chapter"
import { Skeleton } from "@/app/_components/Skeleton"

interface CategoryI {
  _id: string
  name: string
}

interface Props {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ success?: string }>;
}

export const dynamic = "force-dynamic";

// Cache the course data fetching
const getCourseData = unstable_cache(
  async (courseId: string, userId: string) => {
    await connectMongoose()

    try {
      await Chapter.find().limit(0).exec()
      await Attachment.find().limit(0).exec()
    } catch (error) {
      console.error("Error registering models:", error)
    }

    // Find the course with populated attachments, chapters, and quizzes
    const course = await Course.findOne({
      _id: courseId,
      userId,
    })
      .populate({
        path: "attachments",
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: "chapters",
        options: { sort: { position: 1 } },
      })
      .lean<CourseI>()

    if (!course) {
      return null
    }

    // Convert ObjectId fields to strings and serialize quizzes
    const serializedCourse: CourseI = {
      ...course,
      _id: course._id.toString(),
      userId: course.userId.toString(),
      categoryId: course.categoryId ? course.categoryId.toString() : null,
      description: course.description || null,
      imageUrl: course.imageUrl,
      price: course.price ?? null,
      attachments: Array.isArray(course.attachments)
        ? course.attachments.map((attachment) => ({
            _id: attachment._id.toString(),
            name: attachment.name,
            url: attachment.url,
            courseId: attachment.courseId.toString(),
            createdAt: attachment.createdAt,
            updatedAt: attachment.updatedAt,
          }))
        : [],
      chapters: Array.isArray(course.chapters)
        ? course.chapters.map((chapter) => ({
            _id: chapter._id.toString(),
            title: chapter.title,
            description: chapter.description || null,
            videoUrl: chapter.videoUrl || null,
            position: chapter.position,
            isPublished: chapter.isPublished,
            isFree: chapter.isFree,
            courseId: chapter.courseId.toString(),
            createdAt: chapter.createdAt,
            updatedAt: chapter.updatedAt,
          }))
        : [],
    }

    return serializedCourse
  },
  ["course-data"],
  {
    revalidate: 60, // Cache for 1 minute
    tags: ["course-data"],
  },
)

// Cache the categories data fetching
const getCategoriesData = unstable_cache(
  async () => {
    await connectMongoose()

    const categories = await Category.find({})
      .sort({ name: 1 })
      .lean<CategoryI[]>()
      .then((cats) =>
        cats.map((cat) => ({
          _id: cat._id.toString(),
          name: cat.name,
        })),
      )

    return categories
  },
  ["categories-data"],
  {
    revalidate: 60 * 60, // Cache for 1 hour
    tags: ["categories-data"],
  },
)

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const { courseId } = await params

  await connectMongoose()

  const course = await Course.findById(courseId).lean<CourseI>()
  if (!course) {
    return {
      title: "Course Not Found",
      description: "The requested course could not be found.",
    }
  }

  return {
    title: `${course.title}`,
    description: `Set up your course: ${course.title}`,
  }
}

// Loading component for course sections
function CourseSectionSkeleton() {
  return (
    <div className="mt-6 border-neutral-200 bg-neutral-50 rounded-md p-4">
      <div className="flex justify-between items-center mb-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-6 w-full" />
    </div>
  )
}

export default async function CoursePage({ params, searchParams }: Props) {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  if (session.user.role !== "instructor") {
    redirect("/dashboard")
  }

  const { courseId } = await params
  const { success } = await searchParams

  // Connect to MongoDB
  await connectMongoose()

  const user = await User.findOne({ email: session.user.email })
  if (!user) {
    redirect("/dashboard/instructor")
  }

  // Use cached data fetching
  const serializedCourse = await getCourseData(courseId, user._id.toString())
  if (!serializedCourse) {
    redirect("/dashboard/instructor/courses")
  }

  const categories = await getCategoriesData()

  const hasPublishedChapter = serializedCourse.chapters.some((chapter) => chapter.isPublished)

  const requiredFields = [
    serializedCourse.title,
    serializedCourse.description,
    serializedCourse.imageUrl,
    serializedCourse.price,
    serializedCourse.categoryId,
    hasPublishedChapter,
  ]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `(${completedFields}/${totalFields})`
  const isComplete = requiredFields.every(Boolean)

  return (
    <main id="content">
      <div className="max-w-[85rem] px-4 sm:px-4 lg:px-6 mx-auto dark:bg-neutral-900">
        <div className="mx-auto mb-8 lg:mb-10">
          <h2 className="text-3xl text-gray-800 font-bold dark:text-neutral-200">
            Course: <span className="text-lime-600">{serializedCourse.title}</span>
          </h2>
        </div>

        {success === "true" && (
          <AlertBanner variant="success" description="Course updated successfully!" />
        )}

        {!serializedCourse.isPublished && (
          <AlertBanner
            variant="warning"
            description="This course is unpublished, it will not be visible to students. Complete all required fields to publish this course"
          />
        )}
        <div className="py-10 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
          <div className="flex items-center justify-between px-4">
            <div className="flex flex-col gap-y-2">
              <h3 className="text-2xl font-medium text-gray-800 dark:text-neutral-200">Course Setup</h3>
              <span className="text-sm text-slate-700 dark:text-neutral-400">Complete all fields {completionText}</span>
            </div>
            <CourseAction disabled={!isComplete} initialData={serializedCourse} courseId={serializedCourse._id} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 px-4">
            <div>
              <div className="flex items-center gap-x-2">
                <RiApps2AiLine className="h-6 w-6 text-lime-600" />
                <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">Customize your course</h3>
              </div>

              <Suspense fallback={<CourseSectionSkeleton />}>
                <TitleForm initialData={serializedCourse} courseId={serializedCourse._id} />
              </Suspense>

              <Suspense fallback={<CourseSectionSkeleton />}>
                <DescriptionForm initialData={serializedCourse} courseId={serializedCourse._id} />
              </Suspense>

              <Suspense fallback={<CourseSectionSkeleton />}>
                <ImageForm initialData={serializedCourse} courseId={serializedCourse._id} />
              </Suspense>

              <Suspense fallback={<CourseSectionSkeleton />}>
                <CategoryForm initialData={serializedCourse} courseId={serializedCourse._id} categories={categories} />
              </Suspense>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <FaListCheck className="h-6 w-6 text-lime-600" />
                  <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">Course Chapters</h3>
                </div>
                <Suspense fallback={<CourseSectionSkeleton />}>
                  <ChapterForm initialData={serializedCourse} courseId={serializedCourse._id} />
                </Suspense>
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <FaDollarSign className="h-6 w-6 text-lime-600" />
                  <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">Sell your course</h3>
                </div>

                <Suspense fallback={<CourseSectionSkeleton />}>
                  <PriceForm initialData={serializedCourse} courseId={serializedCourse._id} />
                </Suspense>
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <FaRegFile className="h-6 w-6 text-lime-600" />
                  <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">Resources & Attachments</h3>
                </div>

                <Suspense fallback={<CourseSectionSkeleton />}>
                  <AttachmentForm initialData={serializedCourse} courseId={serializedCourse._id} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
