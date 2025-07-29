import { NextResponse } from 'next/server';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '@/app/lib/aws';

export async function PATCH(request, context) {
  const { orderId } = await context.params;
  try {
    const { status } = await request.json();
    if (!['open', 'paid', 'delivered', 'failed', 'closed'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }
    
    let updateExpression = 'set #status = :status';
    const expressionAttributeValues = { ':status': status };
    
    // Add timestamp based on status
    if (status === 'delivered') {
      updateExpression += ', deliveredAt = :deliveredAt';
      expressionAttributeValues[':deliveredAt'] = new Date().toISOString();
    }
    if (status === 'closed') {
      updateExpression += ', closedAt = :closedAt';
      expressionAttributeValues[':closedAt'] = new Date().toISOString();
    }
    
    await docClient.send(new UpdateCommand({
      TableName: 'Orders',
      Key: { orderId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: expressionAttributeValues,
    }));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH /api/admin/orders/[orderId] error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update order', error: error.message, stack: error.stack }, { status: 500 });
  }
} 