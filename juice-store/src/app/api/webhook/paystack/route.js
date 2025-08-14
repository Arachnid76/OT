import { NextResponse } from "next/server";
import crypto from "crypto";
import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req) {
    try {
        const body = await req.text(); // Raw body for signature verification
        const signature = req.headers.get("x-paystack-signature");

        const hash = crypto.createHmac("sha512", PAYSTACK_SECRET).update(body).digest("hex");

        if (hash !== signature) {
            return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
        }

        const event = JSON.parse(body);

        if (event.event === "charge.success") {
            const { metadata, status } = event.data;
            const orderId = metadata.orderId;

            // Update DynamoDB order to "paid"
            await dynamoDB
                .update({
                    TableName: "Orders",
                    Key: { orderId },
                    UpdateExpression: "set #s = :status",
                    ExpressionAttributeNames: { "#s": "status" },
                    ExpressionAttributeValues: { ":status": "paid" }
                })
                .promise();
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
