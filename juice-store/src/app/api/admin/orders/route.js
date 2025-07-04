import { NextResponse } from 'next/server';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '@/app/lib/aws';

export async function GET() {
  try {
    const result = await docClient.send(new ScanCommand({ TableName: 'Orders' }));
    return NextResponse.json({ success: true, orders: result.Items || [] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch orders', error: error.message }, { status: 500 });
  }
} 