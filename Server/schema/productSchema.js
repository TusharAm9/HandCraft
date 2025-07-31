import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  longDescription: {
    type: String,
    required: [true, "Please enter product description"],
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
    maxLength: [8, "Price cannot exceed 99,99,999"],
  },
  category: {
    type: String,
    required: [true, "Please specify a category"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter stock quantity"],
    maxLength: [5, "Stock cannot exceed 99,999"],
    default: 1,
  },
  images: [
    {
      public_id: { type: String },
      url: { type: String, required: true },
    },
  ],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  rating: { type: Number, default: 0 },
  numOfReviews: { type: Number, default: 0 },
  originalPrice: { required: true, type: Number },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Product", productSchema);
