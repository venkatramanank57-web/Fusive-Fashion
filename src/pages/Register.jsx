// =====================================
// src/pages/Register.jsx
// Clean Card Layout with Inner Rounded Left Section
// =====================================

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

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
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
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

    const { fullName, email, password } = formData;

    if (!fullName || !email || !password) {
      return showToast("All fields are required", "error");
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return showToast("Invalid email address", "error");
    }

    if (password.length < 8) {
      return showToast("Password must be at least 8 characters", "error");
    }

    dispatch(setLoading(true));

    try {
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const { data } = await registerMutation({
        variables: {
          input: {
            firstName,
            lastName,
            email,
            password,
            acceptsMarketing: false
          }
        }
      });

      const createResult = data?.customerCreate;

      if (createResult?.customerUserErrors?.length > 0) {
        const errorMsg = createResult.customerUserErrors[0].message;
        dispatch(setError(errorMsg));
        return showToast(errorMsg, "error");
      }

      const loginResponse = await loginMutation({
        variables: { input: { email, password } }
      });

      const loginResult = loginResponse?.data?.customerAccessTokenCreate;

      if (loginResult?.customerUserErrors?.length > 0) {
        showToast("Account created. Please login manually.", "success");
        return navigate("/login");
      }

      const token = loginResult?.customerAccessToken?.accessToken;
      const expiry = loginResult?.customerAccessToken?.expiresAt;

      localStorage.setItem("customerToken", token);
      localStorage.setItem("tokenExpiry", expiry);

      dispatch(
        registerSuccess({
          token,
          expiry,
          profile: createResult.customer
        })
      );

      showToast("Registration successful!", "success");
      setTimeout(() => navigate("/account"), 1000);

    } catch (err) {
      dispatch(setError(err.message));
      showToast("Registration failed. Try again.", "error");
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
          
          {/* Left Gradient Box (Now Fully Rounded & Not Touching Edges) */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-2xl p-16 text-white flex-col justify-between">
            
            <div className="text-5xl font-bold opacity-90">
              *
            </div>
            
            <div className="space-y-6">
              <p className="text-sm opacity-80">
                You can easily
              </p>
              
              <h1 className="text-4xl font-semibold leading-snug">
                Get access your personal hub
                for clarity and productivity
              </h1>
            </div>
            
          </div>
          
          {/* Right Form Section */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-6">
            
            <div className="mb-10">
              <div className="text-indigo-600 text-3xl mb-3">*</div>
              
              <h2 className="text-3xl font-semibold text-gray-900">
                Create an account
              </h2>
              
              <p className="mt-3 text-gray-500 text-sm max-w-sm">
                Access your tasks, notes, and projects anytime.
              </p>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-6">
              
              <input
                name="fullName"
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
              
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
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? "Creating..." : "Get Started"}
                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
              </button>
              
            </form>
            
            <div className="mt-8 text-sm text-gray-500 text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}