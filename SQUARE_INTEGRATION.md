# Square Payment Integration

This document outlines the Square payment integration that has replaced the previous Stripe implementation.

## Overview

The application now uses Square Web Payments SDK for processing payments instead of Stripe. This provides a secure, PCI-compliant payment processing solution.

## Components

### 1. SquarePaymentForm Component (`src/components/SquarePaymentForm.tsx`)

A React component that wraps the Square Web Payments SDK to provide a secure payment form.

**Features:**
- Credit card processing
- Tokenized payment data
- SSL encryption indicators
- Error handling

**Props:**
- `totalAmount`: Payment amount in cents
- `onPaymentSuccess`: Callback for successful payment
- `onPaymentError`: Callback for payment errors
- `isProcessing`: Loading state
- `customerInfo`: Customer information

### 2. Square Payment Function (`supabase/functions/create-square-payment/index.ts`)

A Supabase Edge Function that processes Square payments on the server side.

**Features:**
- Payment processing with Square API
- Transaction storage in database
- Error handling and logging
- Customer information handling

### 3. Database Schema

A new `transactions` table has been created to store payment information:

```sql
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  amount BIGINT NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'square',
  customer_email TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  square_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Square Configuration
VITE_SQUARE_APPLICATION_ID=your_square_application_id
VITE_SQUARE_LOCATION_ID=your_square_location_id
VITE_SQUARE_ENVIRONMENT=sandbox  # or 'production'

# Supabase Edge Function Environment Variables
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_ENVIRONMENT=sandbox  # or 'production'
```

## Setup Instructions

1. **Create a Square Account**
   - Sign up at [squareup.com](https://squareup.com)
   - Complete the application process
   - Get your Application ID and Access Token

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in your Square credentials
   - Set the environment (sandbox for testing, production for live)

3. **Deploy Supabase Functions**
   - Deploy the `create-square-payment` function
   - Set the required environment variables in Supabase

4. **Test the Integration**
   - Use Square's sandbox environment for testing
   - Test with Square's test card numbers
   - Verify payment processing and database storage

## Testing

### Test Card Numbers (Sandbox)

- **Visa**: 4111 1111 1111 1111
- **Mastercard**: 5555 5555 5555 4444
- **American Express**: 3782 822463 10005
- **Discover**: 6011 1111 1111 1117

### Test CVV
Use any 3-digit number for Visa/Mastercard/Discover, or 4-digit for American Express.

## Migration from Stripe

The following changes were made during the migration:

1. **Removed Stripe Dependencies**
   - Deleted Stripe-related Supabase functions
   - Removed Stripe payment form fields
   - Updated checkout flow

2. **Added Square Integration**
   - Installed Square Web Payments SDK
   - Created Square payment component
   - Implemented Square payment processing

3. **Updated Database**
   - Added transactions table
   - Removed Stripe-specific fields
   - Added Square payment tracking

## Security Features

- **PCI Compliance**: Square handles all sensitive payment data
- **Tokenization**: Payment data is tokenized before processing
- **SSL Encryption**: All communications are encrypted
- **Row Level Security**: Database access is properly secured

## Error Handling

The integration includes comprehensive error handling:

- **Client-side**: Payment form validation and error display
- **Server-side**: Payment processing errors and logging
- **Database**: Transaction storage and retrieval errors

## Monitoring

Monitor your Square integration through:

- **Square Dashboard**: Payment analytics and reporting
- **Supabase Logs**: Function execution and errors
- **Application Logs**: Custom error tracking and debugging

## Support

For issues with the Square integration:

1. Check the Square Developer Documentation
2. Review Supabase function logs
3. Verify environment variables are correctly set
4. Test with Square's sandbox environment first
