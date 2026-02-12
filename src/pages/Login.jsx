// =====================================
// src/pages/Login.jsx
// PURPOSE:
// Customer login page - Split Screen Layout with Rounded Left Side
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
    <div className="min-h-screen bg-white flex relative z-10">
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      
      {/* Left Column - Branding & Visual with Rounded Corners */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-900 to-baltic overflow-hidden rounded-br-[48px] rounded-tr-[48px]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Content */}
        <div className="relative flex flex-col justify-between p-12 w-full">
          <div>
            <Link to="/" className="inline-block">
              <span className="text-2xl font-light tracking-widest text-white">
                Fusive Fashion
              </span>
            </Link>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl font-light text-white leading-tight">
              Welcome Back to
              <br />
              <span className="font-medium">Fusive Fashion</span>
            </h1>
            <p className="text-gray-200 text-lg max-w-md">
              Sign in to access your account, manage orders, and discover new arrivals tailored just for you.
            </p>
            
            {/* Testimonial/Stats */}
            <div className="pt-6">
              <div className="flex items-center gap-4 text-white">
                <div className="border-r border-white/30 pr-4">
                  <p className="text-2xl font-bold">50K+</p>
                  <p className="text-sm text-gray-200">Happy Customers</p>
                </div>
                <div className="border-r border-white/30 pr-4">
                  <p className="text-2xl font-bold">10K+</p>
                  <p className="text-sm text-gray-200">Products</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-sm text-gray-200">Support</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-white/80 text-sm">
            <p>© 2024 Fusive Fashion. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Mobile Logo (visible only on mobile) */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-light tracking-widest text-baltic">
                Fusive Fashion
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-light text-gray-900">
              Sign in
            </h2>
            <p className="mt-2 text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-baltic hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-xl">
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
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-baltic hover:underline">
                    Forgot password?
                  </Link>
                </div>
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
                <div className="mt-2">
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
    </div>
  );
}