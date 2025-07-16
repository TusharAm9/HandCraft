import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import productSlice from "./slice/productSlice";
import adminSlice from "./slice/adminSlice";

export const store = configureStore({
  reducer: { userSlice, productSlice, adminSlice },
});
