import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { Metadata } from "next";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import connectMongoose from "@/lib/mongoose-connect";
import Chapter from "@/models/Chapter";
import User from "@/models/User";
import { RiApps2AiLine, RiVideoLine } from "react-icons/ri";
import { AiTwotoneEye } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import AccessForm from "./_components/AccessForm";
import VideoForm from "./_components/VideoForm";
import type { ChapterI } from "@/types/course";
import AlertBanner from "@/app/_components/AlertBanner";
import ChapterAction from "./_components/ChapterAction";
import { Skeleton } from "@/app/_components/Skeleton";
import LinkWithProgress from "@/app/_components/link-with-progress";

interface Props {
  params: Promise<{ chapterId: string; courseId: string }>;
  searchParams: Promise<{ success?: string }>;
}

export const dynamic = "force-dynamic";

// Cache the chapter data fetching
const getChapterData = unstable_cache(
  async (chapterId: string, courseId: string) => {
    await connectMongoose();

    const chapter = await Chapter.findOne({
      _id: chapterId,
      courseId: courseId,
    }).lean<ChapterI>();

    if (!chapter) {
      return null;
    }

    // Convert ObjectId fields to strings
    const serializedChapter: ChapterI = {
      ...chapter,
      _id: chapter._id.toString(),
      courseId: chapter.courseId.toString(),
      title: chapter.title || "",
      description: chapter.description || null,
      videoUrl: chapter.videoUrl || null,
      position: chapter.position,
      isPublished: chapter.isPublished,
      isFree: chapter.isFree,
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt,
    };

    return serializedChapter;
  },
  ["chapter-data"],
  {
    revalidate: 60, // Cache for 1 minute
    tags: ["chapter-data"],
  }
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapterId } = await params;

  await connectMongoose();

  const chapter = await Chapter.findById(chapterId).lean<ChapterI>();
  if (!chapter) {
    return {
      title: "Chapter Not Found",
      description: "The requested chapter could not be found.",
    };
  }

  return {
    title: `${chapter.title}`,
    description: `Set up your course chapter: ${chapter.title}`,
  };
}

// Loading component for chapter sections
function ChapterSectionSkeleton() {
  return (
    <div className="mt-6 border-neutral-200 bg-neutral-50 rounded-md p-4">
      <div className="flex justify-between items-center mb-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-6 w-full" />
    </div>
  );
}

export default async function ChapterPage({ params, searchParams }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "instructor") {
    redirect("/dashboard");
  }

  const { courseId, chapterId } = await params;
  const { success } = await searchParams;

  await connectMongoose();

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    redirect("/dashboard/instructor");
  }

  // Use cached data fetching
  const serializedChapter = await getChapterData(chapterId, courseId);
  if (!serializedChapter) {
    redirect(`/dashboard/instructor/courses/${courseId}`);
  }

  const requiredFields = [
    serializedChapter.title,
    serializedChapter.description,
    serializedChapter.videoUrl,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <main id="content">
      <div className="max-w-[85rem] px-4 sm:px-4 lg:px-6 mx-auto dark:bg-neutral-900 my-14">
        <div className="flex items-center justify-between mx-auto mb-8 lg:mb-10">
          <LinkWithProgress
            href={`/dashboard/instructor/courses/${courseId}`}
            className="py-3 px-4 flex items-center gap-x-2 text-base font-medium rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          >
            <IoMdArrowRoundBack />
            Back to course setup
          </LinkWithProgress>
        </div>

        {success === "true" && (
          <AlertBanner variant="success" description="Chapter updated successfully!" />
        )}

        {!serializedChapter.isPublished && (
          <AlertBanner
            variant="warning"
            description="This chapter is unpublished. It will not be visible in the course"
          />
        )}

        <div className="py-10 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
          <div className="flex items-center justify-between px-4">
            <div className="flex flex-col gap-y-2">
              <h3 className="text-2xl font-medium text-gray-800 dark:text-neutral-200">Chapter Setup</h3>
              <span className="text-sm text-slate-700 dark:text-neutral-400">Complete all fields {completionText}</span>
            </div>
            <ChapterAction
              disabled={!isComplete}
              initialData={serializedChapter}
              chapterId={serializedChapter._id}
              courseId={courseId}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 px-4">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <RiApps2AiLine className="h-6 w-6 text-lime-500" />
                  <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">Customize your chapter</h3>
                </div>

                <Suspense fallback={<ChapterSectionSkeleton />}>
                  <TitleForm initialData={serializedChapter} chapterId={serializedChapter._id} courseId={courseId} />
                </Suspense>

                <Suspense fallback={<ChapterSectionSkeleton />}>
                  <DescriptionForm
                    initialData={serializedChapter}
                    chapterId={serializedChapter._id}
                    courseId={courseId}
                  />
                </Suspense>
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <AiTwotoneEye className="h-6 w-6 text-lime-500" />
                  <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">Access Settings</h3>
                </div>

                <Suspense fallback={<ChapterSectionSkeleton />}>
                  <AccessForm initialData={serializedChapter} chapterId={serializedChapter._id} courseId={courseId} />
                </Suspense>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <RiVideoLine className="h-6 w-6 text-lime-500" />
                  <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">Video</h3>
                </div>

                <Suspense fallback={<ChapterSectionSkeleton />}>
                  <VideoForm initialData={serializedChapter} chapterId={serializedChapter._id} courseId={courseId} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}