import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: [true, "Please provide a rating"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"],
  },
  comment: {
    type: String,
    required: [true, "Please provide a comment"],
    trim: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Review must be linked to a product"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Review must be linked to a user"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
