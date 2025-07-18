import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utility/axiosInstance.js";
import { toast } from "react-hot-toast";

export const loginUserThunk = createAsyncThunk(
  "users/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/login", {
        email,
        password,
      });
      toast.success("Login successful!");
      return response.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  "users/register",
  async (
    { fullName, phoneNumber, password, gender, email },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("user/register", {
        fullName,
        email,
        phoneNumber,
        password,
        gender,
      });
      toast.success("Account created successfully!");
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUserThunk = createAsyncThunk(
  "users/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/logout", {});
      toast.success("Logged out successfully!");
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const getUserThunk = createAsyncThunk(
  "users/getuser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/get-user-profile");
      toast.success("Welcome back");
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const getUserCartThunk = createAsyncThunk(
  "user/cart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/cart");
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getUserAddressThunk = createAsyncThunk(
  "user/savedAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/address");
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const addUserAddressThunk = createAsyncThunk(
  "user/address",
  async (
    { name, phone, street, city, state, zipCode, isDefault },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/user/address", {
        name,
        phone,
        street,
        city,
        state,
        zipCode,
        isDefault,
      });
      toast.success("Address added successfully");
      return response.data.responseData;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const removeItemThunk = createAsyncThunk(
  "user/cart/removeitems",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete("/user/cart/removeitem", {
        data: { productId },
      });
      toast.success("item removed successfully!");
      return response.data.responseData;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const createRazorpayOrderThunk = createAsyncThunk(
  "payment/createRazorpayOrder",
  async ({ amount }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user-order/create-order", {
        amount,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Payment Init Failed"
      );
    }
  }
);

export const verifyRazorpayPaymentThunk = createAsyncThunk(
  "payment/verifyAndCreateOrder",
  async (paymentData, { rejectWithValue }) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderData,
      } = paymentData;

      if (!orderData) {
        return rejectWithValue("Order data is required");
      }

      const { itemList, totalAmount, customerAddress } = orderData;
      console.log(customerAddress);

      if (!itemList || !totalAmount || !customerAddress) {
        return rejectWithValue("Missing required order fields");
      }

      if (!itemList.length) {
        return rejectWithValue("Order must contain at least one item");
      }
      const { name, street, city, state, zipCode, phone } = customerAddress;
      if (!street || !city || !state || !zipCode || !phone) {
        return rejectWithValue("Complete address is required");
      }
      const response = await axiosInstance.post("/user-order/verifyPayment", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderData,
      });
      toast.success("Payment successful! Your order is now being processed.");
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Payment verification failed";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getUserOrdersThunk = createAsyncThunk(
  "user/orders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/orders");
      return response.data?.responseData;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);
