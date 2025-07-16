import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmation, sendStatusUpdate } from '@/lib/emailService'

export async function POST(request: NextRequest) {
  try {
    const { type, email, phone, orderDetails, customerInfo, status } = await request.json()

    const results = {
      email: { success: false, error: null as any },
      sms: { success: false, error: null as any }
    }

    // Send email notification
    if (email && customerInfo.email) {
      try {
        let emailResult
        
        if (type === 'order_confirmation') {
          emailResult = await sendOrderConfirmation(customerInfo.email, orderDetails, customerInfo)
        } else if (type === 'status_update') {
          emailResult = await sendStatusUpdate(customerInfo.email, orderDetails, customerInfo, status)
        }
        
        results.email = emailResult || { success: false, error: 'Unknown email type' }
      } catch (error) {
        results.email = { success: false, error: error.message }
      }
    }

    // SMS notification (mock implementation - you'd use Twilio, etc.)
    if (phone && customerInfo.phone) {
      // Mock SMS sending
      results.sms = { success: true, error: 'SMS sent successfully (mock)' }
      console.log(`SMS would be sent to ${customerInfo.phone}:`, 
        type === 'order_confirmation' 
          ? `Order #${orderDetails.order_number} confirmed. Total: ₹${orderDetails.total_amount.toFixed(2)}`
          : `Order #${orderDetails.order_number} status updated to: ${status}`
      )
    }

    return NextResponse.json({
      success: true,
      results
    })

  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

function generateEmailContent(orderNumber: string, status: string, message: string, customerName: string) {
  const statusEmojis = {
    received: '📋',
    preparing: '👨‍🍳',
    ready: '✅',
    completed: '🎉',
    cancelled: '❌'
  };

  const statusTitles = {
    received: 'Order Received',
    preparing: 'Order Being Prepared',
    ready: 'Order Ready',
    completed: 'Order Completed',
    cancelled: 'Order Cancelled'
  };

  return {
    subject: `${statusEmojis[status as keyof typeof statusEmojis] || '📋'} TCH Order #${orderNumber} - ${statusTitles[status as keyof typeof statusTitles] || 'Status Update'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #B66A55; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">The Chai House</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Order Update</p>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333; margin-top: 0;">Hi ${customerName}!</h2>
          <p style="color: #666; line-height: 1.6;">${message}</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #333;"><strong>Order Number:</strong> ${orderNumber}</p>
            <p style="margin: 5px 0 0 0; color: #333;"><strong>Status:</strong> ${statusTitles[status as keyof typeof statusTitles] || status}</p>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/track" style="background-color: #B66A55; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Track Your Order
            </a>
          </div>
          
          <p style="color: #666; text-align: center; margin-top: 30px; font-size: 14px;">
            Thank you for choosing The Chai House!<br>
            Questions? Reply to this email or call us.
          </p>
        </div>
      </div>
    `
  };
}

function generateSMSContent(orderNumber: string, status: string, message: string) {
  const statusEmojis = {
    received: '📋',
    preparing: '👨‍🍳',
    ready: '✅',
    completed: '🎉',
    cancelled: '❌'
  };

  return `${statusEmojis[status as keyof typeof statusEmojis] || '📋'} TCH Order #${orderNumber}: ${message} Track: ${process.env.NEXT_PUBLIC_SITE_URL}/track`;
}
