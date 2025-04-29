import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import CreateForm from './CreateForm';


export const metadata: Metadata = {
    title: 'Create Course',
    description: 'Create a course',
  };

export default async function CreateCourse() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'instructor') {
    redirect('/dashboard');
  }

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-24">
        <CreateForm />
      </div>
    </div>
  );
}
