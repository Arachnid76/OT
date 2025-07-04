import { NextResponse } from 'next/server';
import { docClient } from '@/app/lib/aws';
import { successResponse, errorResponse, validateRequiredFields } from '@/app/lib/api';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        validateRequiredFields({ email }, ['email']);

        const command = new GetCommand({
            TableName: 'Cart',
            Key: { email }
        });

        const { Item } = await docClient.send(command);
        return successResponse({ cart: Item?.items || [] });
    } catch (error) {
        return errorResponse('Failed to fetch cart', 500, error);
    }
}

export async function POST(request) {
    try {
        const { email, items } = await request.json();
        validateRequiredFields({ email, items }, ['email', 'items']);

        const command = new PutCommand({
            TableName: 'Cart',
            Item: {
                email,
                items,
                updatedAt: new Date().toISOString()
            }
        });

        await docClient.send(command);
        return successResponse({ message: 'Cart updated successfully' });
    } catch (error) {
        return errorResponse('Failed to update cart', 500, error);
    }
} 