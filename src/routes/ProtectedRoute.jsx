// =====================================
// src/routes/ProtectedRoute.jsx
// PURPOSE:
// - Protects routes that require authentication
// - Redirects to login if not authenticated
// - Validates token expiry
// =====================================

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const customerToken = useSelector((state) => state.customer.token);
  const location = useLocation();

  // Check if token exists and is valid
  const isTokenValid = () => {
    if (!customerToken) return false;
    
    // Check localStorage for expiry
    const expiry = localStorage.getItem('customer_token_expiry');
    if (!expiry) return true; // If no expiry saved, assume valid
    
    return new Date(expiry) > new Date();
  };

  if (!customerToken || !isTokenValid()) {
    // Redirect to login, but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}