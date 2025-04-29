import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Metadata } from 'next';
import connectMongoose from '@/lib/mongoose-connect';
import Chapter from '@/models/Chapter';
import User from '@/models/User';
import { RiApps2AiLine, RiVideoLine } from 'react-icons/ri';
import { AiTwotoneEye } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import TitleForm from './_components/TitleForm';
import DescriptionForm from './_components/DescriptionForm';
import AccessForm from './_components/AccessForm';
import VideoForm from './_components/VideoForm';
import { ChapterI } from '@/types/course';
import Link from 'next/link';
import AlertBanner from '@/app/components/AlertBanner';
import ChapterAction from './_components/ChapterAction';

interface Props {
  params: Promise<{ chapterId: string, courseId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapterId } = await params;

  await connectMongoose();

  const chapter = await Chapter.findById(chapterId).lean<ChapterI>();
  if (!chapter) {
    return {
      title: 'Chapter Not Found',
      description: 'The requested chapter could not be found.',
    };
  }

  return {
    title: `${chapter.title}`,
    description: `Set up your course chapter: ${chapter.title}`,
  };
}

export default async function ChapterPage({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'instructor') {
    redirect('/dashboard');
  }

  const { courseId, chapterId } = await params;

  await connectMongoose();

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    redirect('/dashboard/instructor');
  }

  const chapter = await Chapter.findOne({
    _id: chapterId,
    courseId: courseId,
  }).lean<ChapterI>();

  if (!chapter) {
    redirect(`/dashboard/instructor/courses/${courseId}`);
  }

  // Convert ObjectId fields to strings
  const serializedChapter: ChapterI = {
    ...chapter,
    _id: chapter._id.toString(),
    courseId: chapter.courseId.toString(),
    title: chapter.title || '',
    description: chapter.description || null,
    videoUrl: chapter.videoUrl || null,
    position: chapter.position,
    isPublished: chapter.isPublished,
    isFree: chapter.isFree,
    createdAt: chapter.createdAt,
    updatedAt: chapter.updatedAt,
  };

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
          <Link href={`/dashboard/instructor/courses/${courseId}`}
            className="py-3 px-4 flex items-center gap-x-2 text-base font-medium rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
            <IoMdArrowRoundBack />
            Back to course setup
          </Link>
        </div>

        {!chapter.isPublished && (
          <AlertBanner variant="warning" description="This chapter is unpublished. It will not be visible in the course" />
        )}

        <div className="py-10 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
          <div className="flex items-center justify-between px-4">
            <div className="flex flex-col gap-y-2">
              <h3 className="text-2xl font-medium text-gray-800 dark:text-neutral-200">
                Chapter Setup
              </h3>
              <span className="text-sm text-slate-700 dark:text-neutral-400">
                Complete all fields {completionText}
              </span>
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
                  <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">
                    Customize your chapter
                  </h3>
                </div>

                <TitleForm
                  initialData={serializedChapter}
                  chapterId={serializedChapter._id}
                  courseId={courseId}
                />

                <DescriptionForm
                  initialData={serializedChapter}
                  chapterId={serializedChapter._id}
                  courseId={courseId}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <AiTwotoneEye className="h-6 w-6 text-lime-500" />
                  <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">
                    Access Settings
                  </h3>
                </div>

                <AccessForm
                  initialData={serializedChapter}
                  chapterId={serializedChapter._id}
                  courseId={courseId}
                />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <RiVideoLine className="h-6 w-6 text-lime-500" />
                  <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">
                    Video
                  </h3>
                </div>

                <VideoForm
                  initialData={serializedChapter}
                  chapterId={serializedChapter._id}
                  courseId={courseId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}