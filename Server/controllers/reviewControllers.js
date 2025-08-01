import Review from "../schema/reviewSchema.js";
import Product from "../schema/productSchema.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { errorHandler } from "../utility/errorHandler.js";

export const addReviewToProduct = asyncHandler(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const userId = req.user.id;
  if (!rating || !comment) {
    return next(new errorHandler("Rating and comment are required", 400));
  }
  const product = await Product.findById(productId).populate("reviews");

  if (!product) {
    return next(new errorHandler("Product not found", 404));
  }
  const alreadyReviewed = await Review.findOne({
    _id: { $in: product.reviews },
    user: userId,
  });

  if (alreadyReviewed) {
    return next(
      new errorHandler("You have already reviewed this product", 400)
    );
  }
  const newReview = await Review.create({
    user: userId,
    rating,
    comment,
    product: productId,
  });

  const reviews = await Review.find({ product: product._id });
  const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  product.rating = averageRating;
  product.numOfReviews = reviews.length;
  product.reviews.push(newReview._id);

  await product.save({ validateBeforeSave: false });

  res.status(201).json({
    success: true,
    responseData: newReview,
  });
});
