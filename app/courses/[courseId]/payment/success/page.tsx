'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { courseId } = useParams(); // Get courseId from dynamic route
  const { data: session, status } = useSession();
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  useEffect(() => {
    console.log('Success page URL:', window.location.href);
    console.log('Params:', { courseId, reference });

    async function verifyPayment() {
      if (!courseId || !reference) {
        console.error('Missing payment details:', { courseId, reference });

        // Fallback: Check if user is enrolled
        if (status === 'authenticated' && session?.user?.id && courseId) {
          try {
            const response = await fetch(`/api/user/enrolled?courseId=${courseId}`, {
              method: 'GET',
              credentials: 'include',
            });
            const data = await response.json();
            if (response.ok && data.isEnrolled) {
              toast.success('You are already enrolled!');
              router.push('/dashboard/student/courses');
              return;
            }
          } catch (error) {
            console.error('Enrollment check error:', error);
          }
        }

        toast.error('Missing payment details. Please try again.');
        router.push('/courses');
        return;
      }

      try {
        const response = await fetch(`/api/enroll?courseId=${courseId}&reference=${reference}`, {
          method: 'GET',
          credentials: 'include',
        });

        console.log('Enroll API response:', {
          status: response.status,
          ok: response.ok,
        });

        if (response.ok) {
          toast.success('Payment successful! You are now enrolled.');
          router.push('/dashboard/student/courses');
        } else {
          const data = await response.json();
          console.error('Enroll API error:', data);
          toast.error(data.error || 'Failed to verify payment');
          router.push('/courses');
        }
      } catch (error) {
        console.error('Verification error:', error);
        toast.error('Something went wrong');
        router.push('/courses');
      }
    }

    verifyPayment();
  }, [courseId, reference, router, session, status]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-10 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Processing Payment...
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Please wait while we verify your payment.
        </p>
      </div>
    </main>
  );
}