// =====================================
// src/features/customer/customerSlice.jsx
// PURPOSE:
// This file DEFINES CUSTOMER AUTH STATE.
// It handles:
// - Storing Shopify customer access token
// - Clearing token on logout
// - Auto-login from localStorage
// - Customer profile and orders
// =====================================

import { createSlice } from "@reduxjs/toolkit";

// Check localStorage for existing token on initial load
const getInitialToken = () => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('customer_token');
  const expiry = localStorage.getItem('customer_token_expiry');
  
  // Check if token is expired
  if (token && expiry && new Date(expiry) > new Date()) {
    return token;
  }
  
  // Clear expired token
  if (token) {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_token_expiry');
  }
  
  return null;
};

const customerSlice = createSlice({
  name: "customer",

  // Initial customer state with auto-login
  initialState: {
    token: getInitialToken(),
    profile: null,
    orders: [],
    loading: false,
    error: null,
    isAuthenticated: !!getInitialToken(),
  },

  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Login success
    loginSuccess: (state, action) => {
      const { token, expiry } = action.payload;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('customer_token', token);
        if (expiry) {
          localStorage.setItem('customer_token_expiry', expiry);
        }
      }
    },

    // Set customer profile
    setProfile: (state, action) => {
      state.profile = action.payload;
    },

    // Set customer orders
    setOrders: (state, action) => {
      state.orders = action.payload;
    },

    // Registration success
    registerSuccess: (state, action) => {
      const { token, expiry, profile } = action.payload;
      state.token = token;
      state.profile = profile;
      state.isAuthenticated = true;
      state.error = null;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('customer_token', token);
        if (expiry) {
          localStorage.setItem('customer_token_expiry', expiry);
        }
      }
    },

    // Logout customer
    logout: (state) => {
      state.token = null;
      state.profile = null;
      state.orders = [];
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('customer_token');
        localStorage.removeItem('customer_token_expiry');
      }
    },

    // Update profile
    updateProfile: (state, action) => {
      state.profile = {
        ...state.profile,
        ...action.payload
      };
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  setLoading,
  setError,
  loginSuccess,
  setProfile,
  setOrders,
  registerSuccess,
  logout,
  updateProfile,
  clearError
} = customerSlice.actions;

export default customerSlice.reducer;