import { asyncHandler } from "../utility/asyncHandler.js";
import { errorHandler } from "../utility/errorHandler.js";
import jwt from "jsonwebtoken";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  // Get token from cookies or Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.replace("Bearer ", "");
  }

  if (!token) {
    return next(new errorHandler("Access denied. No token provided", 401));
  }

  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = tokenData;
    next();
  } catch (error) {
    return next(new errorHandler("Invalid or expired token", 401));
  }
});
