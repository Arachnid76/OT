import { NextResponse } from 'next/server';
import { saveOrder } from '@/app/lib/order';

export async function POST(request) {
    try {
        const body = await request.json();
        const { phone, name, items, total } = body;

        // Basic validation
        if (!phone || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Missing required fields or cart is empty.' }, { status: 400 });
        }

        // Paystack payment initialization
        const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: phone + '@organicthings.com', // Use phone as a unique identifier for Paystack
                amount: Math.round(total * 100),
                currency: 'GHS',
                callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you`,
                metadata: {
                    items: items,
                    total: total,
                    phone,
                    name,
                },
            }),
        });

        const paystackData = await paystackResponse.json();

        if (!paystackData.status) {
            return NextResponse.json({ 
                success: false, 
                message: paystackData.message || 'Payment initialization failed' 
            }, { status: 400 });
        }

        // Save order to DynamoDB with status 'open'
        const orderId = paystackData.data.reference || `order_${Date.now()}`;
        await saveOrder({
            orderId,
            phone,
            name: name || '',
            items,
            total,
            status: 'open',
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json({
            success: true,
            authorization_url: paystackData.data.authorization_url,
            reference: paystackData.data.reference,
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'An internal server error occurred.' }, { status: 500 });
    }
} 