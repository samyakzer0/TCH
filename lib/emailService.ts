// Email service using Nodemailer (for development/testing)
import nodemailer from 'nodemailer'

// For production, you'd use services like SendGrid, AWS SES, etc.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export async function sendOrderConfirmation(
  customerEmail: string,
  orderDetails: any,
  customerInfo: any
) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@thechai.house',
      to: customerEmail,
      subject: `Order Confirmation - #${orderDetails.order_number}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #B66A55; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">The Chai House</h1>
            <p style="margin: 5px 0 0 0;">Order Confirmation</p>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">Thank you for your order!</h2>
              <p>Hi ${customerInfo.name},</p>
              <p>We've received your order and will start preparing it shortly.</p>
              
              <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <strong>Order Details:</strong><br>
                Order Number: <strong>${orderDetails.order_number}</strong><br>
                Total: <strong>$${orderDetails.total_amount.toFixed(2)}</strong><br>
                Status: <strong>${orderDetails.status}</strong>
              </div>
              
              <p>You can track your order status at: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/track">Track Order</a></p>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #666; font-size: 14px;">
                  Questions? Contact us at info@thechai.house<br>
                  The Chai House - Brewing memories, one cup at a time
                </p>
              </div>
            </div>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: error.message }
  }
}

export async function sendStatusUpdate(
  customerEmail: string,
  orderDetails: any,
  customerInfo: any,
  newStatus: string
) {
  try {
    const statusMessages = {
      'pending': 'Your order has been received and is being prepared.',
      'preparing': 'Your order is now being prepared by our team.',
      'ready': 'Your order is ready for pickup/delivery!',
      'completed': 'Your order has been completed. Thank you!'
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@thechai.house',
      to: customerEmail,
      subject: `Order Update - #${orderDetails.order_number}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #B66A55; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">The Chai House</h1>
            <p style="margin: 5px 0 0 0;">Order Status Update</p>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 20px; border-radius: 8px;">
              <h2 style="color: #333; margin-top: 0;">Order Status Updated</h2>
              <p>Hi ${customerInfo.name},</p>
              <p>${statusMessages[newStatus] || 'Your order status has been updated.'}</p>
              
              <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <strong>Order #${orderDetails.order_number}</strong><br>
                Status: <strong style="color: #B66A55;">${newStatus.toUpperCase()}</strong><br>
                Total: $${orderDetails.total_amount.toFixed(2)}
              </div>
              
              ${newStatus === 'ready' ? `
                <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <strong style="color: #155724;">🎉 Your order is ready!</strong><br>
                  Please collect your order from The Chai House.
                </div>
              ` : ''}
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #666; font-size: 14px;">
                  Questions? Contact us at info@thechai.house
                </p>
              </div>
            </div>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: error.message }
  }
}
