import { createSlice } from "@reduxjs/toolkit";
import {
  addUserAddressThunk,
  createRazorpayOrderThunk,
  getUserAddressThunk,
  getUserCartThunk,
  getUserOrdersThunk,
  getUserThunk,
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
  removeItemThunk,
  updateCartQuantityThunk,
  verifyRazorpayPaymentThunk,
} from "../thunk/userThunk";

const initialState = {
  isAuthenticated: false,
  screenLoading: true,
  userProfile: null,
  cartItems: [],
  userAddresses: [],
  addedAddress: false,
  razorpayOrder: null,
  userOrders: [],
  paymentVerification: {
    loading: false,
    success: false,
    error: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Login action
    builder.addCase(loginUserThunk.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.isAuthenticated = true;
      state.userProfile = action.payload?.responseData?.user;
    });
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.screenLoading = false;
    });

    // register action
    builder.addCase(registerUserThunk.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.isAuthenticated = true;
      state.userProfile = action.payload?.responseData?.user;
    });
    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.screenLoading = false;
    });

    // Logout action
    builder.addCase(logoutUserThunk.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(logoutUserThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.isAuthenticated = false;
      state.userProfile = null;
      localStorage.clear();
    });
    builder.addCase(logoutUserThunk.rejected, (state, action) => {
      state.screenLoading = false;
    });

    // get-cart-details action
    builder.addCase(getUserCartThunk.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(getUserCartThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.cartItems = action.payload?.responseData;
    });
    builder.addCase(getUserCartThunk.rejected, (state, action) => {
      state.screenLoading = false;
    });

    // remove from cart action
    builder.addCase(removeItemThunk.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(removeItemThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.isAuthenticated = true;
      state.cartItems = action.payload;
    });
    builder.addCase(removeItemThunk.rejected, (state, action) => {
      state.screenLoading = false;
    });

    // Get user details
    builder.addCase(getUserThunk.pending, (state) => {
      state.screenLoading = true;
    });
    builder.addCase(getUserThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.userProfile = action.payload.responseData?.user;
      state.isAuthenticated = true;
    });
    builder.addCase(getUserThunk.rejected, (state) => {
      state.screenLoading = false;
      state.userProfile = null;
      state.isAuthenticated = false;
    });

    // Add address thunk
    builder.addCase(addUserAddressThunk.pending, (state) => {
      state.screenLoading = true;
    });
    builder.addCase(addUserAddressThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.userAddresses.push(action.payload);
      state.addedAddress = true;
    });
    builder.addCase(addUserAddressThunk.rejected, (state) => {
      state.screenLoading = false;
    });

    // get user addresses
    builder.addCase(getUserAddressThunk.pending, (state) => {
      state.screenLoading = true;
    });
    builder.addCase(getUserAddressThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.userAddresses = action.payload.responseData;
    });
    builder.addCase(getUserAddressThunk.rejected, (state) => {
      state.screenLoading = false;
    });

    // razorpay order
    builder.addCase(createRazorpayOrderThunk.pending, (state) => {
      state.screenLoading = true;
    });
    builder.addCase(createRazorpayOrderThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.razorpayOrder = action.payload;
    });
    builder.addCase(createRazorpayOrderThunk.rejected, (state) => {
      state.screenLoading = false;
    });

    //razorpay verify

    builder.addCase(verifyRazorpayPaymentThunk.pending, (state) => {
      state.paymentVerification.loading = true;
      state.paymentVerification.success = false;
      state.paymentVerification.error = null;
    });
    builder.addCase(verifyRazorpayPaymentThunk.fulfilled, (state, action) => {
      state.paymentVerification.loading = false;
      state.paymentVerification.success = true;
      state.cartItems = action.payload?.cart || [];
    });
    builder.addCase(verifyRazorpayPaymentThunk.rejected, (state, action) => {
      state.paymentVerification.loading = false;
      state.paymentVerification.success = false;
      state.paymentVerification.error = action.payload;
    });

    // useOrdeers thunk

    builder.addCase(getUserOrdersThunk.pending, (state) => {
      state.screenLoading = true;
    });
    builder.addCase(getUserOrdersThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.userOrders = action.payload || [];
    });
    builder.addCase(getUserOrdersThunk.rejected, (state, action) => {
      state.screenLoading = false;
    });

    // update cart quantity
    builder
      .addCase(updateCartQuantityThunk.pending, (state) => {
        state.screenLoading = true;
        state.error = null;
      })
      .addCase(updateCartQuantityThunk.fulfilled, (state, action) => {
        state.screenLoading = false;
        const { productId, quantity } = action.meta.arg;

        const index = state.cartItems.findIndex(
          (item) => item._id === productId
        );
        if (index !== -1) {
          state.cartItems[index].quantity = quantity;
        }
      })
      .addCase(updateCartQuantityThunk.rejected, (state, action) => {
        state.screenLoading = false;
        console.log(action.payload);
        state.error = action.payload || "Failed to update cart quantity";
      });
  },
});

// Action creators are generated for each case reducer function
export const {} = userSlice.actions;

export default userSlice.reducer;
