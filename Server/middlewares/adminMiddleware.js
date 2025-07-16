import { asyncHandler } from "../utility/asyncHandler.js";
import { errorHandler } from "../utility/errorHandler.js";
import User from "../schema/userSchema.js";

export const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new errorHandler("Authentication required", 401));
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new errorHandler("User not found", 404));
    }
    if (user.role !== "admin") {
      return next(new errorHandler("Unauthorized Access - Admins only", 403));
    }
    next();
  } catch (error) {
    console.error("Database error in admin middleware:", error);
    return next(new errorHandler("Database error", 500));
  }
});
