// src/lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  // Configure with your email service
  service: 'gmail', // or SendGrid, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendOrderConfirmation(order: any) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: order.customerEmail,
    subject: `Order Confirmation - ${order.code}`,
    html: `
      <h2>Order Confirmed!</h2>
      <p>Your order ${order.code} has been received.</p>
      <p>Pickup time: ${order.pickupSlot}</p>
      <p>Total: $${(order.totalCents/100).toFixed(2)}</p>
    `
  });
}