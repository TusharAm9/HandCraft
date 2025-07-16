import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createRazorpayOrder,
  getAllOrders,
  updateOrderStatus,
  verifyRazorpayPayment,
} from "../controllers/orderControllers.js";

import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = express.Router();

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
