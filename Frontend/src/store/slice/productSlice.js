import { createSlice } from "@reduxjs/toolkit";
import {
  addNewProductThunk,
  addToCartThunk,
  getProductsThunk,
  getProductThunk,
} from "../thunk/productThunk";
const initialState = {
  screenLoading: false,
  products: [],
  cart: [],
  buttonLoading: false,
  product: null,
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // setNewMessage: (state, action) => {
    //   const oldMessages = [...state.messages] ? [...state.messages] : [];
    //   state.messages = [...oldMessages, action.payload];
    // },
  },
  extraReducers: (builder) => {
    // get-product action
    builder.addCase(getProductsThunk.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(getProductsThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.products = action.payload?.responseData?.products || [];
    });
    builder.addCase(getProductsThunk.rejected, (state, action) => {
      state.screenLoading = false;
    });

    // get-product details action
    builder.addCase(getProductThunk.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(getProductThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.product = action.payload;
    });
    builder.addCase(getProductThunk.rejected, (state, action) => {
      state.screenLoading = false;
    });

    //add to cart
    builder.addCase(addToCartThunk.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(addToCartThunk.fulfilled, (state, action) => {
      console.log("Response:", action.payload);
      state.screenLoading = false;
      state.cart = action.payload;
    });
    builder.addCase(addToCartThunk.rejected, (state, action) => {
      state.screenLoading = false;
    });
    // add new product
    builder
      .addCase(addNewProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = [...state.products, action.payload];
        console.log(action.payload);
      })
      .addCase(addNewProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const {} = productSlice.actions;

export default productSlice.reducer;
