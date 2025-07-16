import express from "express";

import {
  login,
  logout,
  register,
  getUserProfile,
  getCartItems,
  addUserAddress,
  getUserAddress,
  removeCartItem,
  getUserOrders,
} from "../controllers/userControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get-user-profile", authMiddleware, getUserProfile);
router.post("/logout", authMiddleware, logout);
router.get("/cart", authMiddleware, getCartItems);
router.post("/address", authMiddleware, addUserAddress);
router.get("/address", authMiddleware, getUserAddress);
router.delete("/cart/removeitem", authMiddleware, removeCartItem);
router.get("/orders", authMiddleware, getUserOrders);

export default router;
