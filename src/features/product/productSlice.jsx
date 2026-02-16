import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    currentProduct: null,
  },
  reducers: {
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
});

export const { setCurrentProduct, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
