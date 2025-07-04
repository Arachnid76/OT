import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from './aws';

export async function saveOrder(order) {
  await docClient.send(new PutCommand({
    TableName: 'Orders',
    Item: order,
  }));
} 