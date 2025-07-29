import { NextResponse } from 'next/server';
import { updateOrderStatus } from '@/app/lib/order';

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
            // Update order status to 'paid' in DynamoDB
            try {
                await updateOrderStatus(reference, 'paid', {
                    paymentAmount: transaction.amount / 100 // Convert from kobo to GHS
                });
            } catch (dbError) {
                console.error('Error updating order status:', dbError);
                // Continue with verification even if DB update fails
            }

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
            // Update order status to 'failed' if payment was not successful
            try {
                await updateOrderStatus(reference, 'failed');
            } catch (dbError) {
                console.error('Error updating failed order status:', dbError);
            }

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