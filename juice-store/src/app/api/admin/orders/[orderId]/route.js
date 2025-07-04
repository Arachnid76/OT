import { NextResponse } from 'next/server';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '@/app/lib/aws';

export async function PATCH(request, { params }) {
  const { orderId } = params;
  try {
    const { status } = await request.json();
    if (!['open', 'closed'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }
    await docClient.send(new UpdateCommand({
      TableName: 'Orders',
      Key: { orderId },
      UpdateExpression: 'set #status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': status },
    }));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update order', error: error.message }, { status: 500 });
  }
} 