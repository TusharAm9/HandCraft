import { createSlice } from "@reduxjs/toolkit";
import { getAllOrdersThunk, updateOrderStatusThunk } from "../thunk/adminThunk";

const initialState = {
  isAuthenticated: false,
  screenLoading: true,
  products: [],
  orders: [],
  totalOrders: 0,
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get all orders
    builder.addCase(getAllOrdersThunk.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(getAllOrdersThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.isAuthenticated = true;
      state.orders = action.payload?.responseData;
      state.totalOrders = action.payload?.totalOrders;
      state.products = action.payload?.products;
    });
    builder.addCase(getAllOrdersThunk.rejected, (state, action) => {
      state.screenLoading = false;
    });

    //update order
    builder
      .addCase(updateOrderStatusThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.orders.findIndex(
          (o) => o.orderId === updated.orderId
        );
        if (index !== -1) {
          state.orders[index] = updated;
        }
      })
      .addCase(updateOrderStatusThunk.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

// Action creators are generated for each case reducer function
export const {} = adminSlice.actions;

export default adminSlice.reducer;
