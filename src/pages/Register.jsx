// =====================================
// src/pages/Register.jsx
// Split Screen Authentication Layout with Rounded Left Side
// =====================================

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";

import {
  CUSTOMER_REGISTER,
  CUSTOMER_LOGIN
} from "../api/shopify/customer";

import {
  registerSuccess,
  setLoading,
  setError,
  clearError
} from "../features/customer/customerSlice";

import Toast from "../components/Toast";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const [registerMutation, { loading }] = useMutation(CUSTOMER_REGISTER);
  const [loginMutation] = useMutation(CUSTOMER_LOGIN);

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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    if (formData.password.length < 8) {
      showToast("Password must be at least 8 characters long", "error");
      return;
    }

    dispatch(setLoading(true));

    try {
      // Split full name into first and last name
      const nameParts = formData.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const { data } = await registerMutation({
        variables: {
          input: {
            firstName,
            lastName,
            email: formData.email,
            password: formData.password,
            acceptsMarketing: false
          }
        }
      });

      const createResult = data.customerCreate;

      if (createResult.customerUserErrors.length > 0) {
        const errorMsg = createResult.customerUserErrors[0].message;
        dispatch(setError(errorMsg));
        showToast(errorMsg, "error");
        return;
      }

      const loginResponse = await loginMutation({
        variables: {
          input: {
            email: formData.email,
            password: formData.password
          }
        }
      });

      const loginResult = loginResponse.data.customerAccessTokenCreate;

      if (loginResult.customerUserErrors.length > 0) {
        showToast("Account created. Please login manually.", "success");
        navigate("/login");
        return;
      }

      const token = loginResult.customerAccessToken.accessToken;
      const expiry = loginResult.customerAccessToken.expiresAt;

      localStorage.setItem("customerToken", token);
      localStorage.setItem("tokenExpiry", expiry);

      dispatch(
        registerSuccess({
          token,
          expiry,
          profile: createResult.customer
        })
      );

      showToast("Registration successful! Welcome.", "success");

      setTimeout(() => {
        navigate("/account");
      }, 1200);

    } catch (error) {
      console.error("Registration error:", error);
      dispatch(setError(error.message));
      showToast("Registration failed. Please try again.", "error");
    } finally {
      dispatch(setLoading(false));
    }
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
                CLASSIC DESIGNS
              </span>
            </Link>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl font-light text-white leading-tight">
              Join Our Community
              <br />
              <span className="font-medium">CLASSIC DESIGNS</span>
            </h1>
            <p className="text-gray-200 text-lg max-w-md">
              Create an account to enjoy exclusive offers, track your orders, and be the first to know about new arrivals.
            </p>
            
            {/* Benefits/Features */}
            <div className="pt-6">
              <div className="flex items-center gap-4 text-white">
                <div className="border-r border-white/30 pr-4">
                  <p className="text-2xl font-bold">Free</p>
                  <p className="text-sm text-gray-200">Shipping</p>
                </div>
                <div className="border-r border-white/30 pr-4">
                  <p className="text-2xl font-bold">30-Day</p>
                  <p className="text-sm text-gray-200">Returns</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-sm text-gray-200">Support</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-white/80 text-sm">
            <p>© 2024 CLASSIC DESIGNS. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Column - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Mobile Logo (visible only on mobile) */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-light tracking-widest text-baltic">
                CLASSIC DESIGNS
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-light text-gray-900">
              Create Account
            </h2>
            <p className="mt-2 text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-baltic hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-xl">
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent outline-none transition"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
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
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent outline-none transition"
                    placeholder="you@example.com"
                    required
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
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                    required
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
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters long
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 bg-baltic text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Sign Up"}
                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
              </button>
            </form>
          </div>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{" "}
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