import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectMongoose from '@/lib/mongoose-connect';
import User from '@/models/User';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    // Verify webhook signature using PAYSTACK_SECRET_KEY
    const hash = crypto
        .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
        .update(body)
        .digest('hex');
    if (hash !== signature) {
        console.error('Invalid webhook signature:', { computed: hash, received: signature });
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === 'charge.success') {
        const { courseId, userId } = event.data.metadata || {};
        const transactionStatus = event.data.status;

        if (!courseId || !userId || transactionStatus !== 'success') {
            console.error('Invalid metadata or transaction status:', { courseId, userId, transactionStatus });
            return NextResponse.json({ error: 'Invalid metadata or transaction status' }, { status: 400 });
        }

        try {
            await connectMongoose();

            const user = await User.findById(userId);
            if (!user) {
                console.error('User not found:', userId);
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            if (!user.enrolledCourses.includes(courseId)) {
                user.enrolledCourses.push(courseId);
                await user.save();
                console.log('User enrolled:', { userId, courseId });
            }

            return NextResponse.json({ message: 'Enrollment processed' });
        } catch (error) {
            console.error('Webhook processing error:', error);
            return NextResponse.json({ error: 'Failed to process enrollment' }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}