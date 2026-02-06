// =====================================
// src/app/persistConfig.js
// PURPOSE:
// This file CONFIGURES REDUX PERSIST.
// It decides:
// - WHERE the Redux state is saved (browser localStorage)
// - WHAT parts of the Redux state should be saved
//
// Goal:
// - Keep cart, customer login, wishlist after page refresh
// - Do NOT persist unnecessary or sensitive data
// =====================================

import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",            // Root key for persisted state
  storage,                // Uses browser localStorage
  whitelist: [
    "cart",               // Persist cart items
    "customer",           // Persist login / access token
    "wishlist",           // Persist wishlist items
  ],
};

export default persistConfig;
