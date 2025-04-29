import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function InstructorOverview() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'instructor') {
    redirect('/dashboard');
  }

  return <div>Instructor Overview</div>;
}
