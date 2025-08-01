import Product from "../schema/productSchema.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { errorHandler } from "../utility/errorHandler.js";
import User from "../schema/userSchema.js";

export const addProduct = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    longDescription,
    originalPrice,
    price,
    category,
    stock,
  } = req.body;

  if (
    !name ||
    !description ||
    !price ||
    !category ||
    !stock ||
    !originalPrice
  ) {
    return next(new errorHandler("All required fields must be provided", 400));
  }

  try {
    const imageUrls =
      req.files?.map((file) => ({
        url: file?.path,
        public_id: file?.filename,
      })) || [];

    const newProduct = await Product.create({
      name,
      description,
      longDescription,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      price: Number(price),
      category,
      stock: Number(stock),
      images: imageUrls,
    });

    res.status(201).json({
      success: true,
      responseData: newProduct,
    });
  } catch (error) {
    if (req.files && req.files.length > 0) {
      const deletePromises = req.files.map((file) =>
        cloudinary.uploader.destroy(file.filename)
      );
      await Promise.all(deletePromises);
    }
    return next(new errorHandler("Failed to create product", 500));
  }
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.productId;
  const updates = req.boody;

  if (!productId || Object.keys(updates).length === 0) {
    return next(new errorHandler("Invalid update request", 400));
  }
  const updateProduct = await Product.findByIdAndUpdate(productId, {
    $set: updates,
  });
  if (!updateProduct) {
    return next(new errorHandler("Product not found!", 404));
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    responseData: updateProduct,
  });
});

export const getProductDetails = asyncHandler(async (req, res, next) => {
  const productId = req.params.productId;

  if (!productId) {
    return next(new errorHandler("Invalid request", 400));
  }
  const product = await Product.findById(productId).populate({
    path: "reviews",
    populate: {
      path: "user",
      select: "fullName avatar",
    },
  });
  if (!product) {
    return next(new errorHandler("Product not found!", 400));
  }
  res.status(200).json({
    success: true,
    responseData: product,
  });
});

export const getProducts = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;

  const skip = (page - 1) * limit;
  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalCount = await Product.countDocuments();

  res.status(200).json({
    success: true,
    page,
    limit,
    totalPage: Math.ceil(totalCount / limit),
    tootalProducts: totalCount,
    responseData: {
      products,
    },
  });
});

export const addToCart = asyncHandler(async (req, res, next) => {
  const { quantity = 1, productId } = req.body;
  if (!productId || quantity <= 0) {
    return next(
      new errorHandler("Product ID and valid quantity are required", 400)
    );
  }
  const product = await Product.findById(productId);
  if (!product) {
    return next(new errorHandler("Product not found", 404));
  }

  // Find the authenticated user (attached from auth middleware)
  const user = await User.findById(req.user.id);

  // Check if product already exists in cart
  const existingItemIndex = user.cartItems.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (existingItemIndex !== -1) {
    user.cartItems[existingItemIndex].quantity += quantity;
  } else {
    user.cartItems.push({ productId, quantity });
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Product added to cart",
    responseData: {
      cart: user.cartItems,
    },
  });
});

export const getBulkProducts = asyncHandler(async (req, res, next) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return next(new errorHandler("Invalid product IDs array", 400));
  }

  const products = await Product.find({ _id: { $in: ids } });

  if (!products || products.length === 0) {
    return next(new errorHandler("No products found", 404));
  }

  res.status(200).json({
    success: true,
    responseData: products,
  });
});

export const mergeGuestCartToUser = asyncHandler(async (req, res, next) => {
  const { guestCartItems } = req.body;
  if (!Array.isArray(guestCartItems) || guestCartItems.length === 0) {
    return next(new errorHandler("Guest cart items are required", 400));
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new errorHandler("User not found", 400));
  }
  for (const item of guestCartItems) {
    const { productId, quantity = 1 } = item;
    if (!productId || quantity <= 0) continue;

    const product = await Product.findById(productId);
    if (!product) continue;

    const existingItemIndex = user.cartItems.findIndex(
      (cartItem) => cartItem.productId.toString() === productId
    );

    if (existingItemIndex !== -1) {
      user.cartItems[existingItemIndex].quantity += quantity;
    } else {
      user.cartItems.push({ productId, quantity });
    }
  }
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Guest cart merged successfully",
    responseData: {
      cart: user.cartItems,
    },
  });
});
