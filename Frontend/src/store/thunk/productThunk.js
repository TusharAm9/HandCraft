import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utility/axiosInstance.js";
import toast from "react-hot-toast";

export const getProductsThunk = createAsyncThunk(
  "/product/all-products",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/product/all-products`, {});
      return response.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getProductThunk = createAsyncThunk(
  "/product/getOne",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/product/${productId}`);
      return response.data.responseData;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const addNewProductThunk = createAsyncThunk(
  "/product/new",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/product/new`, data);
      toast.success("Successfull, Product is live!");
      return response.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const addToCartThunk = createAsyncThunk(
  "/products/cart/add",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/product/cart/add`, {
        productId,
        quantity,
      });
      toast.success("Added to cart!");
      return response.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);
