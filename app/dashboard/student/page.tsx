import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function StudentOverview() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'student') {
    redirect('/dashboard');
  }

  return <div>Hello Student Overview</div>;
}
