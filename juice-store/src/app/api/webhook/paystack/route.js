import { NextResponse } from 'next/server';
import { updateOrderStatus } from '@/app/lib/order';
import crypto from 'crypto';

export async function POST(request) {
    try {
        const body = await request.text();
        const signature = request.headers.get('x-paystack-signature');
        
        // Verify webhook signature
        const hash = crypto
            .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
            .update(body)
            .digest('hex');
        
        if (hash !== signature) {
            console.error('Invalid webhook signature');
            return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(body);
        console.log('Paystack webhook event:', event);

        // Handle different event types
        switch (event.event) {
            case 'charge.success':
                await handleSuccessfulPayment(event.data);
                break;
            case 'transfer.success':
                console.log('Transfer successful:', event.data);
                break;
            case 'charge.failed':
                await handleFailedPayment(event.data);
                break;
            default:
                console.log('Unhandled event type:', event.event);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ success: false, message: 'Webhook processing failed' }, { status: 500 });
    }
}

async function handleSuccessfulPayment(transaction) {
    try {
        const { reference, amount, metadata } = transaction;
        
        console.log('Processing successful payment for reference:', reference);
        
        // Update order status to 'paid'
        await updateOrderStatus(reference, 'paid', {
            paymentAmount: amount / 100 // Convert from kobo to GHS
        });

        console.log('Order status updated to paid for reference:', reference);
        
        // You could also send notifications here (email, SMS, etc.)
        
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
}

async function handleFailedPayment(transaction) {
    try {
        const { reference } = transaction;
        
        console.log('Processing failed payment for reference:', reference);
        
        // Update order status to 'failed'
        await updateOrderStatus(reference, 'failed');

        console.log('Order status updated to failed for reference:', reference);
        
    } catch (error) {
        console.error('Error updating failed order status:', error);
        throw error;
    }
} 