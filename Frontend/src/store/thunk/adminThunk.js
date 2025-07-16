import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utility/axiosInstance.js";
import toast from "react-hot-toast";

export const getAllOrdersThunk = createAsyncThunk(
  "/orders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/user-order/orders`, {});
      return response.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateOrderStatusThunk = createAsyncThunk(
  "/update-status/orderId",
  async ({ orderId, newStatus }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/user-order/update-status/${orderId}`,
        { newStatus }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);
