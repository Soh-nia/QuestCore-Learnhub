import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectMongoose from '@/lib/mongoose-connect';
import User from '@/models/User';

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'student') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
        return NextResponse.json({ error: 'Course ID required' }, { status: 400 });
    }

    try {
        await connectMongoose();

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isEnrolled = user.enrolledCourses.includes(courseId);
        return NextResponse.json({ isEnrolled });
    } catch (error) {
        console.error('Enrollment check error:', error);
        return NextResponse.json({ error: 'Failed to check enrollment' }, { status: 500 });
    }
}