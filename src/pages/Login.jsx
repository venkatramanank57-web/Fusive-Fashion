// =====================================
// src/pages/Login.jsx
// PURPOSE:
// Customer login page
// Shopify customer authentication
// Form validation
// =====================================

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { CUSTOMER_LOGIN } from "../api/shopify/customer";
import { loginSuccess, setLoading, setError, clearError } from "../features/customer/customerSlice";
import Toast from "../components/Toast";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  // GraphQL Mutation
  const [loginMutation] = useMutation(CUSTOMER_LOGIN);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
    dispatch(clearError());
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    dispatch(setLoading(true));

    try {
      const result = await loginMutation({
        variables: {
          input: {
            email: formData.email,
            password: formData.password
          }
        }
      });

      const { data } = result;
      
      if (data.customerAccessTokenCreate.customerUserErrors.length > 0) {
        const error = data.customerAccessTokenCreate.customerUserErrors[0];
        dispatch(setError(error.message));
        showToast(error.message, "error");
        return;
      }

      const token = data.customerAccessTokenCreate.customerAccessToken.accessToken;
      const expiry = data.customerAccessTokenCreate.customerAccessToken.expiresAt;
      
      // Save token to Redux
      dispatch(loginSuccess({ token, expiry }));
      
      showToast("Login successful! Redirecting...", "success");
      
      // Redirect to previous page or account page
      const from = location.state?.from?.pathname || '/account';
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);

    } catch (error) {
      console.error("Login error:", error);
      dispatch(setError(error.message));
      showToast(error.message || "Login failed. Please try again.", "error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGuestCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-2xl font-light tracking-widest text-baltic">
              MAKOVER
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-light text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-baltic focus:ring-baltic border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-baltic hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center py-3 px-4 bg-baltic text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Sign in
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Guest Checkout */}
          <div className="mt-6">
            <button
              onClick={handleGuestCheckout}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Continue as guest
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-baltic hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="text-baltic hover:underline">Terms</Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-baltic hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}