import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, default: 1 },
});

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^\d{10,15}$/, "Invalid phone number"],
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "Male",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Orders" }],
    cartItems: [cartItemSchema],
    address: [addressSchema],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
