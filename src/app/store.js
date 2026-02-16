// =====================================
// src/app/store.js
// PURPOSE:
// This file CREATES THE REDUX STORE.
// It is responsible for:
// - Importing all feature slice reducers
// - Combining them into a single root reducer
// - Applying Redux Persist configuration
// - Exporting one global store for the entire app
//
// IMPORTANT RULE (FOLLOWED HERE):
// features/<feature>/<feature>Slice.jsx
//
// This store is connected in main.jsx using <Provider>
// =====================================

import { configureStore, combineReducers } from "@reduxjs/toolkit";

// Redux Persist (used to save Redux state in localStorage)
import { persistReducer } from "redux-persist";
import persistConfig from "./persistConfig";

// Feature slice reducers (EXACT PATHS – VERY IMPORTANT)
import cartReducer from "../features/cart/cartSlice";
import customerReducer from "../features/customer/customerSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import productReducer from "../features/product/productSlice";


// Combine all feature reducers into one root reducer
const rootReducer = combineReducers({
  cart: cartReducer,         // Cart state (items, checkoutUrl)
  customer: customerReducer, // Customer auth state (token)
  wishlist: wishlistReducer, // Wishlist items
  product: productReducer,   // ⭐ CURRENT PRODUCT (NEW)
});

// Apply Redux Persist to the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create and export Redux store
export const store = configureStore({
  reducer: persistedReducer,

  // Disable serializable check (required for Redux Persist)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
