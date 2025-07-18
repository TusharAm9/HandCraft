import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./DB/connection.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

// routes
import userRoute from "./routess/userRoute.js";
import productRoute from "./routess/productRoute.js";
import orderRoute from "./routess/orderRoute.js";
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/user-order", orderRoute);

// error handling middleware
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`your surver is listining on port ${PORT}`);
});
