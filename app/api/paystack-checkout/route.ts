import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, courseTitle, coursePrice, email } = await req.json();
    if (!courseId || !courseTitle || !coursePrice || !email) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        // Fetch USD to NGN exchange rate
        const exchangeRateResponse = await fetch(
            `https://api.exchangerate-api.com/v4/latest/USD?access_key=${process.env.EXCHANGE_RATE_API_KEY}`
        );
        const exchangeRateData = await exchangeRateResponse.json();
        if (!exchangeRateData.rates?.NGN) {
            return NextResponse.json({ error: 'Failed to fetch exchange rate' }, { status: 500 });
        }
        const exchangeRate = exchangeRateData.rates.NGN;
        const amountInNGN = Math.round(coursePrice * exchangeRate * 100); // Convert USD to NGN and to kobo

        const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${courseId}/payment/success?courseId=${courseId}`;

        const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                amount: amountInNGN,
                currency: 'NGN',
                callback_url: callbackUrl,
                metadata: {
                    courseId,
                    courseTitle,
                    userId: session.user.id,
                    originalPriceUSD: coursePrice,
                    convertedPriceNGN: amountInNGN / 100,
                },
            }),
        });

        const data = await paystackResponse.json();
        if (!paystackResponse.ok || !data.status) {
            console.error('Paystack error:', data);
            return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 });
        }

        return NextResponse.json({ authorization_url: data.data.authorization_url });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}