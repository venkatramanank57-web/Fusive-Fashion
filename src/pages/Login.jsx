// =====================================
// src/pages/Login.jsx
// Clean Card Layout with Inner Rounded Left Section
// Shopify customer authentication
// Form validation
// =====================================

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
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
    password: ""
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const [loginMutation, { loading }] = useMutation(CUSTOMER_LOGIN);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
      
      localStorage.setItem("customerToken", token);
      localStorage.setItem("tokenExpiry", expiry);
      
      dispatch(loginSuccess({ token, expiry }));
      
      showToast("Login successful! Redirecting...", "success");
      
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F2FF] px-6 py-20 relative z-10">
      
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      {/* White Main Card */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-8">
        
        {/* Inner Layout with Gap */}
        <div className="flex gap-8 min-h-[650px]">
          
          {/* Left Gradient Box */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-2xl p-16 text-white flex-col justify-between">
            
            <div className="text-5xl font-bold opacity-90">
              *
            </div>
            
            <div className="space-y-6">
              <p className="text-sm opacity-80">
                Welcome back to
              </p>
              
              <h1 className="text-4xl font-semibold leading-snug">
                Your personal hub for clarity and productivity
              </h1>
              
              <div className="pt-6">
                <div className="flex items-center gap-4 text-white">
                  <div className="border-r border-white/30 pr-4">
                    <p className="text-2xl font-bold">50K+</p>
                    <p className="text-sm text-white/80">Happy Customers</p>
                  </div>
                  <div className="border-r border-white/30 pr-4">
                    <p className="text-2xl font-bold">10K+</p>
                    <p className="text-sm text-white/80">Products</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">24/7</p>
                    <p className="text-sm text-white/80">Support</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          
          {/* Right Form Section */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-6">
            
            <div className="mb-10">
              <div className="text-indigo-600 text-3xl mb-3">*</div>
              
              <h2 className="text-3xl font-semibold text-gray-900">
                Sign in
              </h2>
              
              <p className="mt-3 text-gray-500 text-sm max-w-sm">
                Access your account to manage orders and discover new arrivals.
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              
              <input
                name="email"
                type="email"
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
              
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                
                <Link
                  to="/forgot-password"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
              </button>
              
            </form>
            
            <div className="mt-8 text-sm text-gray-500 text-center">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 font-medium hover:underline"
              >
                Create an account
              </Link>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">
                By continuing, you agree to our{" "}
                <Link to="/terms" className="text-indigo-600 hover:underline">Terms</Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}