// =====================================
// src/features/wishlist/wishlistSlice.jsx
// PURPOSE:
// This file DEFINES WISHLIST STATE.
// It handles:
// - Adding products to wishlist
// - Removing products from wishlist
//
// Wishlist is:
// - Frontend-only feature
// - Persisted in localStorage via Redux Persist
// =====================================

import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",

  // Initial wishlist state
  initialState: {
    items: [],
  },

  reducers: {
    // Toggle product in wishlist
    toggleWishlist(state, action) {
      const item = action.payload;
      
      // Validate and clean the item
      const cleanItem = {
        ...item,
        handle: item.handle || "",
        id: item.id || `${Date.now()}`,
        price: item.price || 0,
        title: item.title || "Untitled Product",
        image: item.image || "https://placehold.co/300x400/cccccc/ffffff?text=No+Image",
        color: item.color || "",
        size: item.size || "",
        variantId: item.variantId || `${item.id}-default`
      };

      // Use handle as primary identifier (fallback to id if no handle)
      const identifier = cleanItem.handle || cleanItem.id;
      const exists = state.items.find(
        (existingItem) => 
          (existingItem.handle && existingItem.handle === cleanItem.handle) ||
          (existingItem.id && existingItem.id === cleanItem.id)
      );

      if (exists) {
        // Remove if already exists
        state.items = state.items.filter(
          (existingItem) => 
            !((existingItem.handle && existingItem.handle === cleanItem.handle) ||
            (existingItem.id && existingItem.id === cleanItem.id))
        );
      } else {
        // Add if not exists
        state.items.push(cleanItem);
      }
    },

    // Clear wishlist
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;