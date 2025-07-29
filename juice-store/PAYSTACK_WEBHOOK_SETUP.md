# Paystack Webhook Setup

This document explains how to set up Paystack webhooks for automatic payment confirmation and order status updates.

## Webhook Endpoint

The webhook endpoint is available at:
```
POST /api/webhook/paystack
```

## Setup Instructions

### 1. Configure Environment Variables

Make sure you have the following environment variables set:
```env
PAYSTACK_SECRET_KEY=your_paystack_secret_key
NEXT_PUBLIC_BASE_URL=your_application_url
```

### 2. Set Up Webhook in Paystack Dashboard

1. Log in to your Paystack Dashboard
2. Go to **Settings** > **Webhooks**
3. Click **Add Webhook**
4. Enter your webhook URL: `https://yourdomain.com/api/webhook/paystack`
5. Select the following events:
   - `charge.success` - When a payment is successful
   - `charge.failed` - When a payment fails
   - `transfer.success` - When a transfer is successful (optional)

### 3. Webhook Security

The webhook endpoint includes signature verification to ensure requests are from Paystack:
- Uses HMAC SHA512 with your secret key
- Verifies the `x-paystack-signature` header
- Rejects requests with invalid signatures

### 4. Order Status Flow

The webhook handles the following order status transitions:

1. **open** → **paid** (when payment is successful)
2. **open** → **failed** (when payment fails)
3. **paid** → **delivered** (manually via admin panel)

### 5. Testing the Webhook

You can test the webhook using Paystack's webhook testing tool or by making a test payment.

## Order Statuses

- **open**: Order created, payment pending
- **paid**: Payment confirmed, order ready for delivery
- **delivered**: Order has been delivered to customer
- **failed**: Payment failed or was declined

## Admin Panel Features

The admin panel (`/admin`) now includes:
- Visual status indicators with color coding
- Buttons to manually update order status
- Automatic timestamp tracking for status changes

## Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check if the webhook URL is accessible
   - Verify the webhook is active in Paystack dashboard
   - Check server logs for errors

2. **Invalid signature errors**
   - Ensure `PAYSTACK_SECRET_KEY` is correct
   - Verify the webhook URL matches exactly

3. **Order status not updating**
   - Check DynamoDB permissions
   - Verify the order exists in the database
   - Check server logs for database errors

### Logs

The webhook logs important events:
- Webhook signature verification
- Payment processing
- Order status updates
- Error messages

Check your server logs to monitor webhook activity and troubleshoot issues. 