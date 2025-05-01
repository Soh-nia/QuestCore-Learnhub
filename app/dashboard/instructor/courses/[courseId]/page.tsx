import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Metadata } from 'next';
import connectMongoose from '@/lib/mongoose-connect';
import Course from '@/models/Course';
import User from '@/models/User';
import Category from '@/models/Category';
import { RiApps2AiLine } from 'react-icons/ri';
import { FaListCheck, FaDollarSign, FaRegFile } from 'react-icons/fa6';
import TitleForm from './_components/TitleForm';
import DescriptionForm from './_components/DescriptionForm';
import ImageForm from './_components/ImageForm';
import CategoryForm from './_components/CategoryForm';
import PriceForm from './_components/PriceForm';
import AttachmentForm from './_components/AttachmentForm';
import { CourseI } from '@/types/course';
import ChapterForm from './_components/ChapterForm';
import AlertBanner from '@/app/components/AlertBanner';
import CourseAction from './_components/CourseAction';

interface Props {
  params: Promise<{ courseId: string }>;
}

interface Category {
  _id: string;
  name: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId } = await params;

  await connectMongoose();

  const course = await Course.findById(courseId).lean<CourseI>();
  if (!course) {
    return {
      title: 'Course Not Found',
      description: 'The requested course could not be found.',
    };
  }

  return {
    title: `${course.title}`,
    description: `Set up your course: ${course.title}`,
  };
}

export default async function CoursePage({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'instructor') {
    redirect('/dashboard');
  }

  const { courseId } = await params;

  // Connect to MongoDB
  await connectMongoose();

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    redirect('/dashboard/instructor');
  }

  // Find the course with populated attachments, chapters, and quizzes
  const course = await Course.findOne({
    _id: courseId,
    userId: user._id,
  })
    .populate({
      path: 'attachments',
      options: { sort: { createdAt: -1 } },
    })
    .populate({
      path: 'chapters',
      options: { sort: { position: 1 } },
    })
    .lean<CourseI>();

  if (!course) {
    redirect('/dashboard/instructor/courses');
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
  };

  const categories = await Category.find({})
    .sort({ name: 1 })
    .lean<Category[]>()
    .then((cats) =>
      cats.map((cat) => ({
        _id: cat._id.toString(),
        name: cat.name,
      }))
    );

  const hasPublishedChapter = serializedCourse.chapters.some(
    (chapter) => chapter.isPublished
  );

  const requiredFields = [
    serializedCourse.title,
    serializedCourse.description,
    serializedCourse.imageUrl,
    serializedCourse.price,
    serializedCourse.categoryId,
    hasPublishedChapter,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <main id="content">
      <div className="max-w-[85rem] px-4 sm:px-4 lg:px-6 mx-auto dark:bg-neutral-900">
        <div className="mx-auto mb-8 lg:mb-10">
          <h2 className="text-3xl text-gray-800 font-bold dark:text-neutral-200">
            Course: <span className="text-lime-600">{serializedCourse.title}</span>
          </h2>
        </div>

        {!course.isPublished && (
          <AlertBanner
            variant="warning"
            description="This course is unpublished, it will not be visible to students. Complete all required fields to publish this course"
          />
        )}
        <div className="py-10 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
          <div className="flex items-center justify-between px-4">
            <div className="flex flex-col gap-y-2">
              <h3 className="text-2xl font-medium text-gray-800 dark:text-neutral-200">
                Course Setup
              </h3>
              <span className="text-sm text-slate-700 dark:text-neutral-400">
                Complete all fields {completionText}
              </span>
            </div>
            <CourseAction
              disabled={!isComplete}
              initialData={serializedCourse}
              courseId={serializedCourse._id}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 px-4">
            <div>
              <div className="flex items-center gap-x-2">
                <RiApps2AiLine className="h-6 w-6 text-lime-600" />
                <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">
                  Customize your course
                </h3>
              </div>

              <TitleForm
                initialData={serializedCourse}
                courseId={serializedCourse._id}
              />

              <DescriptionForm
                initialData={serializedCourse}
                courseId={serializedCourse._id}
              />

              <ImageForm
                initialData={serializedCourse}
                courseId={serializedCourse._id}
              />

              <CategoryForm
                initialData={serializedCourse}
                courseId={serializedCourse._id}
                categories={categories}
              />
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <FaListCheck className="h-6 w-6 text-lime-600" />
                  <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">
                    Course Chapters
                  </h3>
                </div>
                <ChapterForm
                  initialData={serializedCourse}
                  courseId={serializedCourse._id}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <FaDollarSign className="h-6 w-6 text-lime-600" />
                  <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">
                    Sell your course
                  </h3>
                </div>

                <PriceForm
                  initialData={serializedCourse}
                  courseId={serializedCourse._id}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <FaRegFile className="h-6 w-6 text-lime-600" />
                  <h3 className="text-1xl font-medium text-gray-800 dark:text-neutral-200">
                    Resources & Attachments
                  </h3>
                </div>

                <AttachmentForm
                  initialData={serializedCourse}
                  courseId={serializedCourse._id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}