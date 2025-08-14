import { PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from './aws';

export async function saveOrder(order) {
  await docClient.send(new PutCommand({
    TableName: 'Orders',
    Item: order,
  }));
}

export async function updateOrderStatus(orderId, status, additionalData = {}) {
  let updateExpression = 'set #status = :status';
  const expressionAttributeValues = { ':status': status };
  
  // Add timestamp based on status
  switch (status) {
    case 'paid':
      updateExpression += ', paymentConfirmedAt = :paymentTime';
      expressionAttributeValues[':paymentTime'] = new Date().toISOString();
      break;
    case 'delivered':
      updateExpression += ', deliveredAt = :deliveredAt';
      expressionAttributeValues[':deliveredAt'] = new Date().toISOString();
      break;
    case 'failed':
      updateExpression += ', paymentFailedAt = :failedTime';
      expressionAttributeValues[':failedTime'] = new Date().toISOString();
      break;
  }
  
  // Add any additional data
  Object.entries(additionalData).forEach(([key, value]) => {
    updateExpression += `, ${key} = :${key}`;
    expressionAttributeValues[`:${key}`] = value;
  });
  
  await docClient.send(new UpdateCommand({
    TableName: 'Orders',
    Key: { orderId },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: expressionAttributeValues,
  }));
}

export const ORDER_STATUSES = {
  OPEN: 'open',
  PAID: 'paid',
  DELIVERED: 'delivered',
  FAILED: 'failed'
};

export const STATUS_DISPLAY_NAMES = {
  [ORDER_STATUSES.OPEN]: 'Open',
  [ORDER_STATUSES.PAID]: 'Paid',
  [ORDER_STATUSES.DELIVERED]: 'Delivered',
  [ORDER_STATUSES.FAILED]: 'Failed'
}; 