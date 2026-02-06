// =====================================
// src/routes/AppRoutes.jsx
// PURPOSE:
// - Defines all application routes
// - Uses MainLayout for global UI (Announcement, Header, Footer)
// - Separates public & protected routes cleanly
// - Auto scroll to top on route change
// =====================================

import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // You can change to 'auto' for instant scroll
    });
  }, [pathname]);

  return null;
}

// Layout
import MainLayout from "../layouts/MainLayout";

// Pages
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import WishlistPage from "../pages/WishlistPage";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Account from "../pages/Account";
import Orders from "../pages/Orders";
import OrderSuccess from "../pages/OrderSuccess";

// Policy Pages
import PoliciesPage from "../pages/PrivacyPolicy";
import ContactPage from "../pages/ContactPage";

// Route protection
import ProtectedRoutes from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Routes with Global Layout */}
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products/:handle" element={<ProductDetails />} />
          <Route path="/product/:handle" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Policy Pages (Auto-fetch from Shopify) */}
          <Route path="/policy/:type" element={<PoliciesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Redirect old policy URLs to new dynamic routes */}
          <Route path="/privacy-policy" element={<Navigate to="/policy/privacy" replace />} />
          <Route path="/refund-policy" element={<Navigate to="/policy/refund" replace />} />
          <Route path="/terms-of-service" element={<Navigate to="/policy/terms" replace />} />
          <Route path="/shipping-policy" element={<Navigate to="/policy/shipping" replace />} />
          <Route path="/return-policy" element={<Navigate to="/policy/refund" replace />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/account" element={<Account />} />
            <Route path="/orders" element={<Orders />} />
          </Route>

          {/* Order Success */}
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          {/* 404 - Not Found */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-8">Page not found</p>
                <a href="/" className="text-baltic hover:underline">
                  Return to Home
                </a>
              </div>
            </div>
          } />
        </Route>
      </Routes>
    </>
  );
}