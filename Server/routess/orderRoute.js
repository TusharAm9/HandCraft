import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import {
  createRazorpayOrder,
  getAllOrders,
  updateCartQuantity,
  updateOrderStatus,
  verifyRazorpayPayment,
} from "../controllers/orderControllers.js";

const router = express.Router();

router.put("/updateQuantity", authMiddleware, updateCartQuantity);
router.post("/create-order", authMiddleware, createRazorpayOrder);
router.post("/verifyPayment", authMiddleware, verifyRazorpayPayment);
router.get("/orders", authMiddleware, adminMiddleware, getAllOrders);
router.put(
  "/update-status/:orderId",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

export default router;
