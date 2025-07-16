import nodemailer from "nodemailer";
import { errorHandler } from "../utility/errorHandler.js";

// Create transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === "production") {
    return nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use app password for Gmail
      },
    });
  } else {
    // For development - use Ethereal Email (fake SMTP)
    return nodemailer.createTransporter({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.ETHEREAL_EMAIL,
        pass: process.env.ETHEREAL_PASSWORD,
      },
    });
  }
};

export const sendOrderConfirmationEmail = async (userEmail, orderData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@store.com",
      to: userEmail,
      subject: `Order Confirmation - ${orderData.orderId}`,
      html: generateOrderConfirmationHTML(orderData),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Order confirmation email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Order confirmation email error:", error);
    throw new errorHandler("Failed to send order confirmation email", 500);
  }
};

/**
 * Send order status update email
 */
export const sendOrderStatusUpdateEmail = async (
  userEmail,
  orderData,
  newStatus
) => {
  try {
    const transporter = createTransporter();

    const statusMessages = {
      processing: "Your order is being processed",
      shipped: "Your order has been shipped",
      delivered: "Your order has been delivered",
      cancelled: "Your order has been cancelled",
    };

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@yourstore.com",
      to: userEmail,
      subject: `Order Update - ${orderData.orderId} | ${statusMessages[newStatus]}`,
      html: generateOrderStatusUpdateHTML(orderData, newStatus),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Order status update email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Order status update email error:", error);
    // Don't throw error for email failures - just log them
    console.log("Continuing without email notification");
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Send payment failure notification
 */
export const sendPaymentFailureEmail = async (userEmail, orderData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@yourstore.com",
      to: userEmail,
      subject: `Payment Failed - ${orderData.orderId}`,
      html: generatePaymentFailureHTML(orderData),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Payment failure email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Payment failure email error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
