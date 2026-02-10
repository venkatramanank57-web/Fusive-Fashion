// =====================================
// src/pages/Register.jsx
// PURPOSE:
// Customer registration page
// Shopify customer creation
// Form validation
// =====================================

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import { CUSTOMER_REGISTER } from "../api/shopify/customer";
import { registerSuccess, setLoading, setError, clearError } from "../features/customer/customerSlice";
import Toast from "../components/Toast";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    acceptsMarketing: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  // GraphQL Mutation
  const [registerMutation] = useMutation(CUSTOMER_REGISTER);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
    dispatch(clearError());

    // Check password strength
    if (name === "password") {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "Too weak";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
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
      const result = await registerMutation({
        variables: {
          input: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            acceptsMarketing: formData.acceptsMarketing
          }
        }
      });

      const { data } = result;
      
      if (data.customerCreate.customerUserErrors.length > 0) {
        const error = data.customerCreate.customerUserErrors[0];
        dispatch(setError(error.message));
        showToast(error.message, "error");
        return;
      }

      const token = data.customerCreate.customerAccessToken?.accessToken;
      const expiry = data.customerCreate.customerAccessToken?.expiresAt;
      const profile = data.customerCreate.customer;

      if (token) {
        // Save to Redux
        dispatch(registerSuccess({ token, expiry, profile }));
        
        showToast("Registration successful! Welcome to MAKOVER.", "success");
        
        // Redirect to account page
        setTimeout(() => {
          navigate('/account');
        }, 1500);
      } else {
        // Account created but no auto-login
        showToast("Account created successfully! Please sign in.", "success");
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }

    } catch (error) {
      console.error("Registration error:", error);
      dispatch(setError(error.message));
      showToast(error.message || "Registration failed. Please try again.", "error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 z-10 relative">
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
            Create your account
          </h1>
          <p className="mt-2 text-gray-600">
            Join our community of fashion lovers
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent outline-none transition"
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent outline-none transition"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

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
                  autoComplete="new-password"
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
              
              {/* Password Strength */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Password strength:</span>
                    <span className="text-sm font-medium text-gray-700">
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                      style={{ width: `${passwordStrength * 25}%` }}
                    />
                  </div>
                  <ul className="mt-2 text-xs text-gray-500 space-y-1">
                    <li className="flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      Contains uppercase letter
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      Contains number
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      Contains special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Marketing Consent */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="acceptsMarketing"
                  name="acceptsMarketing"
                  type="checkbox"
                  checked={formData.acceptsMarketing}
                  onChange={handleChange}
                  className="h-4 w-4 text-baltic focus:ring-baltic border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="acceptsMarketing" className="text-gray-700">
                  I want to receive marketing promotions and updates via email
                </label>
                <p className="text-gray-500 mt-1">
                  You can unsubscribe at any time. View our{" "}
                  <Link to="/privacy" className="text-baltic hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center py-3 px-4 bg-baltic text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Create account
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
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="w-full inline-block py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Sign in to your account
            </Link>
          </div>
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
  );
}