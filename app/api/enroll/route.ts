import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectMongoose from '@/lib/mongoose-connect';
import User from '@/models/User';
import Course from '@/models/Course';

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'student') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await req.json();

    try {
        await connectMongoose();

        const course = await Course.findById(courseId);
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.enrolledCourses.includes(courseId)) {
            return NextResponse.json({ error: 'Already enrolled' }, { status: 400 });
        }

        user.enrolledCourses.push(courseId);
        await user.save();

        return NextResponse.json({ message: 'Enrolled successfully' });
    } catch (error) {
        console.error('Enrollment error:', error);
        return NextResponse.json({ error: 'Failed to enroll' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const reference = searchParams.get('reference');

    if (!courseId || !reference) {
        console.error('Missing courseId or reference:', { courseId, reference });
        return NextResponse.json({ error: 'Course ID and reference required' }, { status: 400 });
    }

    try {
        await connectMongoose();

        const course = await Course.findById(courseId);
        if (!course) {
            console.error('Course not found:', courseId);
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // Verify Paystack transaction
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (!data.status || data.data.status !== 'success') {
            console.error('Payment verification failed:', data);
            return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/student/courses`);
    } catch (error) {
        console.error('Enrollment verification error:', error);
        return NextResponse.json({ error: 'Failed to verify enrollment' }, { status: 500 });
    }
}