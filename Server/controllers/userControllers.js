import User from "../schema/userSchema.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { errorHandler } from "../utility/errorHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res, next) => {
  const { fullName, phoneNumber, password, gender, email } = req.body;

  if (!fullName || !phoneNumber || !password || !gender || !email) {
    return next(new errorHandler("All fields are required", 400));
  }
  const user = await User.findOne({ email });
  if (user) {
    return next(new errorHandler("email already exists", 400));
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const avatarType = gender === "male" ? "boy" : "girl";
  const avatar = `https://avatar.iran.liara.run/public/${avatarType}`;
  const newUser = await User.create({
    fullName,
    email,
    phoneNumber,
    password: hashedPassword,
    gender,
    avatar,
  });
  const tokenData = {
    id: newUser._id.toString(),
  };
  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      responseData: { newUser, token },
    });
});

export const login = asyncHandler(async (req, res, next) => {
  const { phoneNumber, email, password } = req.body;

  if ((!email && !phoneNumber) || !password) {
    return next(new errorHandler("All fields are required", 400));
  }
  const user = await User.findOne({
    $or: [{ phoneNumber }, { email }],
  });

  if (!user) {
    return next(new errorHandler("Enter valid phoneNumber or password", 400));
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return next(new errorHandler("Enter valid phoneNumber or password", 400));
  }
  const tokenData = {
    id: user._id.toString(),
  };
  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  const userData = user.toObject();
  delete userData.password;

  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      responseData: { user: userData },
    });
});

export const getUserProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select(
    "fullName email phoneNumber avatar role"
  );

  res.json({
    success: true,
    responseData: { user },
  });
});

export const logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      responseData: { message: "Logged out successfully" },
    });
});

export const getCartItems = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("cartItems.productId");
  if (!user) {
    return next(new errorHandler("Login First", 403));
  }
  const cartItems = user.cartItems.map((item) => {
    return {
      _id: item._id,
      quantity: item.quantity,
      product: {
        _id: item.productId._id,
        name: item.productId.name,
        image: item.productId.images?.[0]?.url || null,
        price: item.productId.price,
        originalPrice: item.productId.originalPrice || null,
        category: item.productId.category,
        inStock: item.productId.stock > 0,
      },
    };
  });
  return res.status(200).json({
    success: true,
    responseData: cartItems,
  });
});

export const removeCartItem = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("cartItems.productId");

  const { productId } = req.body;

  if (!user) {
    return next(new errorHandler("Login First", 403));
  }

  if (!productId) {
    return next(new errorHandler("Product ID is required", 400));
  }

  user.cartItems = user.cartItems.filter(
    (item) => item._id.toString() !== productId
  );

  await user.save();

  const cartItems = user.cartItems.map((item) => {
    return {
      _id: item._id,
      quantity: item.quantity,
      product: {
        _id: item.productId._id,
        name: item.productId.name,
        image: item.productId.images?.[0]?.url || null,
        price: item.productId.price,
        originalPrice: item.productId.originalPrice || null,
        category: item.productId.category,
        inStock: item.productId.stock > 0,
      },
    };
  });

  return res.status(200).json({
    success: true,
    responseData: cartItems,
  });
});

export const addUserAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new errorHandler("Login First", 403));
  }
  const { name, phone, street, city, state, zipCode, isDefault } = req.body;

  if (!name || !phone || !street || !city || !state || !zipCode) {
    return next(new errorHandler("All address fields are required", 400));
  }
  if (isDefault) {
    user.address.forEach((addr) => (addr.isDefault = false));
  }
  const newAddress = {
    name,
    phone,
    street,
    city,
    state,
    zipCode,
    isDefault: isDefault || true,
  };

  user.address.push(newAddress);
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Address added successfully",
    responseData: user.address,
  });
});

export const getUserAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("address");

  if (!user) {
    return next(new errorHandler("User not found. Please login again.", 403));
  }

  return res.status(200).json({
    success: true,
    responseData: user.address,
  });
});

export const getUserOrders = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: "orderHistory",
    model: "Orders",
    populate: {
      path: "itemList.productId",
      model: "Product",
    },
  });

  if (!user) {
    return next(new errorHandler("User not found. Please login again.", 403));
  }

  res.status(200).json({
    success: true,
    responseData: user.orderHistory,
  });
});
