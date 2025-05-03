'use client';

import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

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

interface ClientPaymentPageProps {
  course: Course;
  userEmail: string;
  convertedPriceNGN: number | null;
}

export default function ClientPaymentPage({ course, userEmail, convertedPriceNGN }: ClientPaymentPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/paystack-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Ensure cookies are sent
        body: JSON.stringify({
          courseId: course._id,
          courseTitle: course.title,
          coursePrice: course.price,
          email: userEmail,
        }),
      });

      if (response.status === 401) {
        toast.error('Please sign in to proceed with payment');
        await signIn('credentials', { redirect: false }); // Refresh session
        router.push('/auth/signin');
        return;
      }

      const data = await response.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        toast.error(data.error || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Purchase Course
        </h1>
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-full md:w-1/2 h-64">
              <Image
                src={course.imageUrl || 'https://images.unsplash.com/photo-1633114128174-2f8aa49759b0'}
                alt={course.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {course.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {course.description || 'No description available.'}
              </p>
              <div className="mt-4 flex items-center">
                <Image
                  src={course.userId?.image || '/default.jpg'}
                  alt={course.userId?.name || 'Instructor'}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full mr-2"
                />
                <span className="text-gray-600 dark:text-gray-300">
                  {course.userId?.name || 'Unknown Instructor'}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-xl font-bold text-lime-600 dark:text-lime-400">
                  {course.price ? `$${course.price.toFixed(2)}` : 'Free'}
                </span>
                {course.price && convertedPriceNGN && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Approx. ₦{convertedPriceNGN.toFixed(2)} (converted at checkout)
                  </p>
                )}
              </div>
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className={`mt-6 px-6 py-2 flex items-center justify-center bg-lime-600 text-white rounded hover:bg-lime-700 transition ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  'Pay Now'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}