import Razorpay from "razorpay";
import crypto from "crypto";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import Orders from "../schema/orderSchema.js";
import User from "../schema/userSchema.js";
import Products from "../schema/productSchema.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { errorHandler } from "../utility/errorHandler.js";
import { sendMail, sendSuccessMail } from "../middlewares/sendMail.js";
const generateOrderId = () => {
  return `ORD-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;
};

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = asyncHandler(async (req, res, next) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid amount",
    });
  }
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };
  const order = await razorpayInstance.orders.create(options);

  res.status(200).json({
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  });
});

// Endpoint 2: Verify Payment Signature
export const verifyRazorpayPayment = asyncHandler(async (req, res, next) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderData,
  } = req.body;
  const userId = req.user.id;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return next(new errorHandler("Missing payment verification fields", 400));
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return next(new errorHandler("Payment verification failed", 403));
  }
  const { itemList, totalAmount, customerAddress } = orderData;

  if (!itemList || !totalAmount || !customerAddress) {
    return next(new errorHandler("Missing required order fields", 400));
  }
  if (!itemList.length) {
    return next(new errorHandler("Order must contain at least one item", 400));
  }
  const { name, street, city, state, zipCode, phone } = customerAddress;
  if (!name || !street || !city || !state || !zipCode || !phone) {
    return next(new errorHandler("Complete address is required", 400));
  }
  try {
    const orderId = generateOrderId();
    const newOrder = new Orders({
      orderId,
      userId,
      itemList,
      totalAmount,
      orderStatus: "pending",
      paymentStatus: "paid",
      customerAddress: {
        name,
        street,
        city,
        state,
        zipCode,
        phone,
      },
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    const savedOrder = await newOrder.save();
    const populatedOrder = await Orders.findById(savedOrder._id)
      .populate("userId", "name email")
      .populate("itemList.productId", "name images");
    const removeUserCart = await User.findById(userId);
    removeUserCart.cartItems = [];
    removeUserCart.orderHistory = savedOrder;
    await removeUserCart.save();

    const data = populatedOrder;
    await sendSuccessMail(
      populatedOrder.userId?.email,
      "Order Successfull",
      data
    );

    res.status(200).json({
      success: true,
      message: "Payment verified and order created successfully",
      paymentVerified: true,
      order: populatedOrder,
      cart: removeUserCart.cartItems,
    });
  } catch (error) {
    console.error("Order creation error after payment verification:", error);
    //uuid error
    if (error.code === 11000) {
      return next(new errorHandler("Order ID conflict, please try again", 500));
    }
    return next(
      new errorHandler(
        "Payment verified but order creation failed. Please contact support.",
        500
      )
    );
  }
});

export const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Orders.find({})
    .populate("userId", "name email")
    .populate("itemList.productId", "name images price category");

  const allProducts = await Products.find({});

  return res.status(200).json({
    success: true,
    totalOrders: orders.length,
    products: allProducts,
    responseData: orders,
  });
});

export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { newStatus } = req.body;

  if (!["pending", "processing", "shipped", "delivered"].includes(newStatus)) {
    return next(new errorHandler("Invalid status value", 400));
  }
  const order = await Orders.findById(orderId).populate("userId");

  if (!order) {
    return next(new errorHandler("Order not found", 404));
  }

  order.orderStatus = newStatus;
  await order.save();

  const data = order;
  await sendMail(order.userId?.email, "Order Update", data);

  res.status(200).json({
    success: true,
    message: `Order status updated to ${newStatus}`,
    updatedOrder: order,
  });
});

export const updateCartQuantity = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || quantity < 1 || !userId) {
    return next(
      new errorHandler(
        "Invalid Request (quantity must be a positive number)",
        400
      )
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new errorHandler("User not found or not authorized.", 404));
  }
  const existingItemIndex = user.cartItems.findIndex(
    (item) => item._id.toString() === productId
  );

  if (existingItemIndex === -1) {
    return next(new errorHandler("Product not found in cart", 404));
  }

  user.cartItems[existingItemIndex].quantity = quantity;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Product Quantity updated",
    quantity: user.cartItems[existingItemIndex].quantity,
  });
});
