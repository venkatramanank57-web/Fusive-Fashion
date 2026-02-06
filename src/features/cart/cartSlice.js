// src/features/cart/cartSlice.jsx

import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],            // 👈 UI cart items (IMPORTANT)
    cartId: null,         // 👈 Shopify cart
    checkoutUrl: null,    // 👈 Shopify checkout
  },
  reducers: {

    // ✅ ADD PRODUCT
    addToCart(state, action) {
      const item = action.payload;

      const existing = state.items.find(
        (i) => i.variantId === item.variantId
      );

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
    },

    // ✅ REMOVE PRODUCT
    removeFromCart(state, action) {
      state.items = state.items.filter(
        (i) => i.variantId !== action.payload
      );
    },

    // ✅ UPDATE QUANTITY
    updateQuantity(state, action) {
      const { variantId, quantity } = action.payload;
      const item = state.items.find(
        (i) => i.variantId === variantId
      );
      if (item) {
        item.quantity = quantity;
      }
    },

    // ✅ CLEAR CART
    clearCart(state) {
      state.items = [];
      state.cartId = null;
      state.checkoutUrl = null;
    },

    // ✅ SHOPIFY CART INFO (Already you had this)
    setCart(state, action) {
      state.cartId = action.payload.cartId;
      state.checkoutUrl = action.payload.checkoutUrl;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCart,
} = cartSlice.actions;

export default cartSlice.reducer;
