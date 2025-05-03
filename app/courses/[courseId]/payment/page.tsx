import { auth } from '@/auth';
import connectMongoose from '@/lib/mongoose-connect';
import CourseModel from '@/models/Course';
import User from '@/models/User';
import Category from '@/models/Category';
import { redirect } from 'next/navigation';
import ClientPaymentPage from './PaymentClient';
import { RawCourseHome } from '@/types/course';

// Define Course interface to match Mongoose schema with string IDs
interface Course {
  _id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  price: number | null;
  isPublished: boolean;
  userId: { _id: string; name: string; image: string | null };
  categoryId: { _id: string; name: string } | null;
}

interface Params {
  courseId: string;
}

interface Props {
  params: Promise<Params>;
}

// Server component to fetch data
export default async function CoursePaymentPage({ params }: Props) {
  const session = await auth();
  if (!session || session.user.role !== 'student') {
    redirect('/auth/signin');
  }

  const { courseId } = await params;

  // Validate courseId
  if (!courseId || typeof courseId !== 'string') {
    return <div>Invalid course ID</div>;
  }

  await connectMongoose();

  try {
    await Category.find().limit(0).exec();
    await User.find().limit(0).exec();
  } catch (error) {
    console.error('Error registering models:', error);
  }

  let course: Course | null = null;
  try {
    const rawCourse = await CourseModel.findById(courseId)
      .select('title description imageUrl price isPublished userId categoryId')
      .populate('userId', 'name image')
      .populate('categoryId', 'name')
      .lean<RawCourseHome>();

    if (rawCourse) {
      // Convert ObjectId instances to strings
      course = {
        _id: rawCourse._id.toString(),
        title: rawCourse.title,
        description: rawCourse.description || null,
        imageUrl: rawCourse.imageUrl || '',
        price: rawCourse.price || null,
        isPublished: rawCourse.isPublished,
        userId: rawCourse.userId
          ? {
              _id: rawCourse.userId._id.toString(),
              name: rawCourse.userId.name,
              image: rawCourse.userId.image || null,
            }
          : { _id: '', name: 'Unknown', image: null },
        categoryId: rawCourse.categoryId
          ? {
              _id: rawCourse.categoryId._id.toString(),
              name: rawCourse.categoryId.name,
            }
          : null,
      };
    }
  } catch (error) {
    console.error('Course fetch error:', error);
    return <div>Error fetching course</div>;
  }

  if (!course || !course.isPublished) {
    return <div>Course not found or not published</div>;
  }

  // Fetch exchange rate for display with fallback
  let convertedPriceNGN: number | null = null;
  try {
    const exchangeRateResponse = await fetch(
      `https://api.exchangerate-api.com/v4/latest/USD?access_key=${process.env.EXCHANGE_RATE_API_KEY}`
    );
    const exchangeRateData = await exchangeRateResponse.json();
    if (exchangeRateData.rates?.NGN && course.price) {
      convertedPriceNGN = course.price * exchangeRateData.rates.NGN;
    }
  } catch (error) {
    console.error('Exchange rate fetch error:', error);
    // Fallback exchange rate (adjust as needed)
    if (course.price) {
      convertedPriceNGN = course.price * 1500; // Example: 1 USD = 1500 NGN
    }
  }

  return (
    <ClientPaymentPage
      course={course}
      userEmail={session.user.email!}
      convertedPriceNGN={convertedPriceNGN}
    />
  );
}