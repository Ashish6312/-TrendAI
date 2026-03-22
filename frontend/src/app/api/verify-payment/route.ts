import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text();
    console.log('--- Incoming Payment Verification Request ---');
    console.log('Body trace:', bodyText);
    
    if (!bodyText) {
       return NextResponse.json({ success: false, message: 'Empty body' }, { status: 400 });
    }
    
    const body = JSON.parse(bodyText);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET || '';
    
    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment is verified
      // Here you can:
      // 1. Update user subscription in database
      // 2. Send confirmation email
      // 3. Log the transaction
      // 4. Update user permissions
      
      console.log('Payment verified successfully:', {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      console.error('Payment verification failed:', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        expectedSignature: generated_signature,
        receivedSignature: razorpay_signature
      });
      
      return NextResponse.json(
        { success: false, message: 'Payment verification failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, message: 'Payment verification failed' },
      { status: 500 }
    );
  }
}