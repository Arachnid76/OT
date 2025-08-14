import { NextResponse } from "next/server";
import crypto from "crypto";
import AWS from "aws-sdk";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = "https://api.paystack.co";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

console.log("PAYSTACK_SECRET_KEY:", process.env.PAYSTACK_SECRET_KEY);

if (!PAYSTACK_SECRET || !BASE_URL) {
    console.error("Missing environment variables: PAYSTACK_SECRET_KEY or NEXT_PUBLIC_BASE_URL");
}

const dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

async function updateOrderStatus(orderId, status, updateData) {
    const params = {
        TableName: "Orders",
        Key: { orderId },
        UpdateExpression: "set #status = :status, #updatedAt = :updatedAt, #paymentAmount = :paymentAmount",
        ExpressionAttributeNames: {
            "#status": "status",
            "#updatedAt": "updatedAt",
            "#paymentAmount": "paymentAmount"
        },
        ExpressionAttributeValues: {
            ":status": status,
            ":updatedAt": new Date().toISOString(),
            ":paymentAmount": updateData.paymentAmount
        }
    };

    try {
        await dynamoDB.update(params).promise();
        console.log(`✅ Order ${orderId} status updated to ${status}`);
    } catch (error) {
        console.error(`❌ Failed to update order ${orderId} status:`, error);
    }
}

export async function POST(req) {
    // Get IP from headers or connection
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
    console.log("Incoming request IP:", ip);

    try {
        const body = await req.json();
        const { email, phone, name, items, payOnDelivery } = body;

        if (!email || !phone || !items || !items.length) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const orderId = crypto.randomUUID();
        // Set callback URL for Paystack to /thank-you (Paystack will append ?reference=...)
        const callbackUrl = `${BASE_URL}/thank-you`;
        console.log("✅ Callback URL:", callbackUrl);

        // Save order to DynamoDB
        try {
            const status = "open"; // Always use "open" for new orders

            await dynamoDB.put({
                TableName: "Orders",
                Item: {
                    orderId,
                    email,
                    phone,
                    name: name || "",
                    items,
                    total,
                    status, // <-- now always "open"
                    createdAt: new Date().toISOString()
                }
            }).promise();
            console.log("✅ Order saved to DynamoDB:", orderId);
        } catch (dbError) {
            console.error("❌ DynamoDB Save Error:", dbError);
        }

        if (payOnDelivery) {
            // Generate a transactionRef for pay on delivery (can use orderId or a new UUID)
            const transactionRef = orderId;
            return NextResponse.json({ success: true, orderId, transactionRef });
        }

        // Call Paystack API
        const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
            },
            body: JSON.stringify({
                email,
                amount: total * 100, // Convert to kobo
                callback_url: callbackUrl,
                metadata: { orderId, phone, name }
            })
        });

        const text = await response.text();
        console.log("🔍 Paystack raw response:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            console.error("❌ Failed to parse Paystack response as JSON:", err);
            return NextResponse.json({ success: false, message: "Invalid response from Paystack" }, { status: 500 });
        }

        if (!data.status) {
            return NextResponse.json({ success: false, message: data.message }, { status: 400 });
        }

        const transaction = data.data;
        const orderIdFromMetadata = transaction.metadata?.orderId;
        const transactionRef = transaction.reference;
        if (orderIdFromMetadata) {
            await updateOrderStatus(orderIdFromMetadata, 'paid', { paymentAmount: transaction.amount / 100 });
        }

        return NextResponse.json({
            success: true,
            orderId: orderIdFromMetadata,
            transactionRef,
            authorization_url: transaction.authorization_url
        });
    } catch (error) {
        console.error("❌ Checkout Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
