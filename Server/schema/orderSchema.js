import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: {
    type: String,
    required: [true, "Please enter product name"],
  },
  price: {
    type: Number,
    required: true,
    max: [99999999, "Price cannot exceed 99,99,999"],
  },
  quantity: {
    type: Number,
    required: [true, "Please specify quantity"],
    min: [1, "Quantity must be at least 1"],
  },
  totalPrice: {
    type: Number,
    required: [true, "Please enter total price"],
    max: [99999999, "Price cannot exceed 99,99,999"],
  },
});

// Then define main order schema
const ordersSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: [true, "Please enter order ID"], // Fixed error message
    trim: true,
    unique: true, // Make sure order IDs are unique
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  itemList: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ["pending", "processing", "shipped", "delivered"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  customerAddress: {
    // Better structure instead of generic Object
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  razorpayOrderId: {
    // Add this for Razorpay order ID
    type: String,
  },
  razorpayPaymentId: {
    // Fixed: should be String, not ObjectId
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Orders", ordersSchema);
