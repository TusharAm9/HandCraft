import Product from "../schema/productSchema.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { errorHandler } from "../utility/errorHandler.js";
import User from "../schema/userSchema.js";

export const addProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;
  if (!name || !description || !price || !category || !stock) {
    return next(new errorHandler("All fields are required", 400));
  }
  try {
    const imageUrls = req.files.map((file) => ({
      url: file?.path,
      public_id: file?.filename,
    }));

    const newProduct = await Product.create({
      name,
      description,
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
  const product = await Product.findById(productId);
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

  const products = await Product.find({});

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

  // Validation
  if (!productId || quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: "Product ID and valid quantity are required",
    });
  }

  // Fetch Product
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Find the authenticated user (attached from auth middleware)
  const user = await User.findById(req.user.id);

  // Check if product already exists in cart
  const existingItemIndex = user.cartItems.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (existingItemIndex !== -1) {
    // Update quantity if exists
    user.cartItems[existingItemIndex].quantity += quantity;
  } else {
    // Else, push new item
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
