import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userRole = session.user.role;

  console.log('Dashboard session:', { userRole, session });

  // Redirect to role-specific dashboard
  if (userRole === 'instructor') {
    redirect('/dashboard/instructor');
  } else if (userRole === 'student') {
    redirect('/dashboard/student');
  } else {
    return <div>Error: Invalid role assigned</div>;
  }
}