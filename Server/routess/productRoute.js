import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  addProduct,
  addToCart,
  getProductDetails,
  getProducts,
  updateProduct,
} from "../controllers/productControllers.js";

import { addReviewToProduct } from "../controllers/reviewControllers.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import upload from "../utility/cloudinary.js";

const router = express.Router();

router.post(
  "/new",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 5),
  addProduct
);
router.get("/all-products", getProducts);
router.get("/:productId", getProductDetails);
router.put(
  "/:productId/update",
  authMiddleware,
  adminMiddleware,
  updateProduct
);
router.post("/cart/add", authMiddleware, addToCart);
router.post("/review/:productId", authMiddleware, addReviewToProduct);

export default router;
