import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const reference = searchParams.get('reference');

        if (!reference) {
            return NextResponse.json({ success: false, message: 'Reference is required' }, { status: 400 });
        }

        // Verify payment with Paystack
        const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });

        const paystackData = await paystackResponse.json();

        if (!paystackData.status) {
            return NextResponse.json({ 
                success: false, 
                message: paystackData.message || 'Payment verification failed' 
            }, { status: 400 });
        }

        const transaction = paystackData.data;

        // Check if payment was successful
        if (transaction.status === 'success') {
            return NextResponse.json({
                success: true,
                message: 'Payment verified successfully',
                transaction: {
                    reference: transaction.reference,
                    amount: transaction.amount / 100, // Convert from kobo to GHS
                    status: transaction.status,
                    metadata: transaction.metadata,
                }
            });
        } else {
            return NextResponse.json({
                success: false,
                message: 'Payment was not successful',
                status: transaction.status
            });
        }

    } catch (error) {
        return NextResponse.json({ success: false, message: 'An internal server error occurred.' }, { status: 500 });
    }
} 