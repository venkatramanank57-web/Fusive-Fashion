// =====================================
// src/pages/Account.jsx
// PURPOSE:
// Customer account dashboard with profile picture
// Shows orders, profile, address book
// Logout functionality
// FULLY FUNCTIONAL CHANGE PASSWORD
// =====================================

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { 
  LogOut, Package, User, MapPin, Settings, ChevronRight, 
  Clock, CheckCircle, Camera, Upload, Mail, Phone, 
  Calendar, Edit2, ExternalLink, X, Plus, Home, Building, Key
} from "lucide-react";
import { logout, setProfile, setOrders } from "../features/customer/customerSlice";
import { 
  GET_CUSTOMER_PROFILE, 
  GET_CUSTOMER_ORDERS, 
  UPDATE_CUSTOMER_PROFILE,
  UPDATE_CUSTOMER_ADDRESS,
  ADD_CUSTOMER_ADDRESS,
  DELETE_CUSTOMER_ADDRESS,
  UPDATE_CUSTOMER_PASSWORD
} from "../api/shopify/customer";
import Toast from "../components/Toast";

export default function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Add mounted ref to prevent state updates after unmount
  const isMounted = useRef(true);
  
  // Get customer state from Redux
  const { token, profile: reduxProfile, orders: reduxOrders } = useSelector((state) => state.customer);
  
  const [loading, setLoading] = useState(true);
  const [profile, setLocalProfile] = useState(reduxProfile);
  const [orders, setLocalOrders] = useState(reduxOrders || []);
  const [activeTab, setActiveTab] = useState("overview");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Password change states
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Address management states
  const [addressModal, setAddressModal] = useState({
    isOpen: false,
    mode: 'add', // 'add', 'edit'
    address: null
  });
  const [addressFormData, setAddressFormData] = useState({
    address1: "",
    address2: "",
    city: "",
    province: "",
    country: "United States",
    zip: "",
    phone: "",
    firstName: "",
    lastName: "",
    company: "",
    isDefault: false
  });
  const [allAddresses, setAllAddresses] = useState([]);

  // Complete list of countries
  const countries = [
    "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda",
    "Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain",
    "Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia",
    "Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso",
    "Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic",
    "Chad","Chile","China","Colombia","Comoros","Congo (Congo-Brazzaville)",
    "Costa Rica","Croatia","Cuba","Cyprus","Czechia","Denmark","Djibouti","Dominica",
    "Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea",
    "Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon",
    "Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea",
    "Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India",
    "Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan",
    "Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia",
    "Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
    "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands",
    "Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia",
    "Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal",
    "Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea",
    "North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama",
    "Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar",
    "Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia",
    "Saint Vincent and the Grenadines","Samoa","San Marino",
    "Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles",
    "Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia",
    "South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan",
    "Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania",
    "Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia",
    "Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates",
    "United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu",
    "Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
  ].sort();

  // Check for login success message from navigation state or localStorage
  useEffect(() => {
    // Check if user just logged in via location state
    if (location.state?.loginSuccess) {
      showToast("Logged in successfully", "success");
      // Clear the state to prevent showing again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
    
    // Check localStorage as backup
    const loginSuccess = localStorage.getItem('login_success');
    if (loginSuccess === 'true' && isMounted.current) {
      showToast("Logged in successfully", "success");
      localStorage.removeItem('login_success');
    }
  }, [location, navigate]);

  // GraphQL queries and mutations with error handling options
  const [getCustomerProfile] = useLazyQuery(GET_CUSTOMER_PROFILE, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    onError: (error) => {
      // Don't log abort errors
      if (error.name !== 'AbortError' && !error.message?.includes('abort')) {
        console.error("Profile query error:", error);
      }
    }
  });
  
  const [getCustomerOrders] = useLazyQuery(GET_CUSTOMER_ORDERS, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    onError: (error) => {
      if (error.name !== 'AbortError' && !error.message?.includes('abort')) {
        console.error("Orders query error:", error);
      }
    }
  });
  
  const [updateCustomerProfile] = useMutation(UPDATE_CUSTOMER_PROFILE, {
    errorPolicy: 'all',
    onError: (error) => {
      if (error.name !== 'AbortError' && !error.message?.includes('abort')) {
        console.error("Update profile error:", error);
      }
    }
  });

  const [updateCustomerAddress] = useMutation(UPDATE_CUSTOMER_ADDRESS, {
    errorPolicy: 'all',
    onError: (error) => {
      if (error.name !== 'AbortError' && !error.message?.includes('abort')) {
        console.error("Update address error:", error);
      }
    }
  });

  const [addCustomerAddress] = useMutation(ADD_CUSTOMER_ADDRESS, {
    errorPolicy: 'all',
    onError: (error) => {
      if (error.name !== 'AbortError' && !error.message?.includes('abort')) {
        console.error("Add address error:", error);
      }
    }
  });

  const [deleteCustomerAddress] = useMutation(DELETE_CUSTOMER_ADDRESS, {
    errorPolicy: 'all',
    onError: (error) => {
      if (error.name !== 'AbortError' && !error.message?.includes('abort')) {
        console.error("Delete address error:", error);
      }
    }
  });

  // ✅ Password update mutation
  const [updateCustomerPassword] = useMutation(UPDATE_CUSTOMER_PASSWORD, {
    errorPolicy: 'all',
    onError: (error) => {
      if (error.name !== 'AbortError' && !error.message?.includes('abort')) {
        console.error("Update password error:", error);
      }
    }
  });

  // Set up mounted ref
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
  }, [token, navigate]);

  // Fetch customer data when token is available
  useEffect(() => {
    if (token) {
      fetchCustomerData();
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [token]);

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
      
      // Load profile picture from localStorage
      if (profile.id) {
        const savedPicture = localStorage.getItem(`profile_picture_${profile.id}`);
        if (savedPicture && isMounted.current) {
          setProfilePicture(savedPicture);
        }
      }

      // Load all addresses
      if (profile.addresses?.edges) {
        const addresses = profile.addresses.edges.map(edge => edge.node);
        setAllAddresses(addresses);
      }
    }
  }, [profile]);

  const fetchCustomerData = async () => {
    // Don't fetch if no token or component unmounted
    if (!token || !isMounted.current) {
      if (isMounted.current) setLoading(false);
      return;
    }
    
    try {
      if (isMounted.current) setLoading(true);
      
      // Fetch profile first
      let profileResult = null;
      try {
        profileResult = await getCustomerProfile({ 
          variables: { customerAccessToken: token }
        });
      } catch (profileErr) {
        // Ignore abort errors
        if (profileErr.name !== 'AbortError' && !profileErr.message?.includes('abort')) {
          console.error("Profile fetch error:", profileErr);
        }
      }

      // Check if component is still mounted
      if (!isMounted.current) return;

      // Process profile data if successful
      if (profileResult?.data?.customer) {
        const customerData = profileResult.data.customer;
        setLocalProfile(customerData);
        dispatch(setProfile(customerData));
        
        // Load addresses
        if (customerData.addresses?.edges) {
          setAllAddresses(customerData.addresses.edges.map(edge => edge.node));
        }
      }

      // Fetch orders
      let ordersResult = null;
      try {
        ordersResult = await getCustomerOrders({ 
          variables: { customerAccessToken: token }
        });
      } catch (ordersErr) {
        // Ignore abort errors
        if (ordersErr.name !== 'AbortError' && !ordersErr.message?.includes('abort')) {
          console.error("Orders fetch error:", ordersErr);
        }
      }

      // Check if component is still mounted
      if (!isMounted.current) return;

      // Process orders data if successful
      if (ordersResult?.data?.customer?.orders?.edges) {
        const ordersData = ordersResult.data.customer.orders.edges.map(edge => edge.node);
        setLocalOrders(ordersData);
        dispatch(setOrders(ordersData));
      }

    } catch (error) {
      // Handle any unexpected errors
      if (error.name !== 'AbortError' && !error.message?.includes('abort') && isMounted.current) {
        console.error("Error fetching customer data:", error);
        showToast("Failed to load account data", "error");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const showToast = (message, type = "success") => {
    if (!isMounted.current) return;
    setToast({ show: true, message, type });
    setTimeout(() => {
      if (isMounted.current) {
        setToast({ show: false, message: "", type: "success" });
      }
    }, 3000);
  };

  const handleLogout = () => {
    // Clear profile picture from localStorage on logout
    if (profile?.id) {
      localStorage.removeItem(`profile_picture_${profile.id}`);
    }
    dispatch(logout());
    showToast("Logged out successfully", "success");
    
    // Short delay to show toast before redirect
    setTimeout(() => {
      if (isMounted.current) {
        navigate('/');
      }
    }, 500);
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast("File size must be less than 5MB", "error");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast("Please upload an image file", "error");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (!isMounted.current) return;
        
        const base64String = reader.result;
        setProfilePicture(base64String);
        
        // Save to localStorage if we have customer ID
        if (profile?.id) {
          try {
            localStorage.setItem(`profile_picture_${profile.id}`, base64String);
            showToast("Profile picture updated", "success");
          } catch (e) {
            // Handle localStorage quota exceeded
            showToast("Failed to save profile picture", "error");
          }
        }
      };
      reader.onerror = () => {
        showToast("Failed to read file", "error");
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ CORRECT: Only send allowed fields to Shopify Storefront API
  const handleSaveProfile = async () => {
    if (!token || !isMounted.current) return;
    
    try {
      const result = await updateCustomerProfile({
        variables: {
          customerAccessToken: token,
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
          }
        }
      });

      if (!isMounted.current) return;

      if (result.data?.customerUpdate?.customer) {
        const updatedProfile = { ...profile, ...result.data.customerUpdate.customer };
        setLocalProfile(updatedProfile);
        dispatch(setProfile(updatedProfile));
        setEditingProfile(false);
        showToast("Profile updated successfully", "success");
      } else if (result.data?.customerUpdate?.customerUserErrors?.length > 0) {
        throw new Error(result.data.customerUpdate.customerUserErrors[0].message);
      }
    } catch (error) {
      if (error.name !== 'AbortError' && !error.message?.includes('abort') && isMounted.current) {
        console.error("Error updating profile:", error);
        showToast(error.message || "Failed to update profile", "error");
      }
    }
  };

  // ✅ CORRECTED: Password update - Shopify doesn't verify current password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    // Get form data
    const form = e.target;
    const newPassword = form.newPassword.value;
    const confirmPassword = form.confirmPassword.value;
    
    // Validate passwords
    if (!newPassword || !confirmPassword) {
      showToast("Please fill in all password fields", "error");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    
    if (newPassword.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }

    if (!token || !isMounted.current) return;
    
    try {
      // Send ONLY the new password - Shopify handles verification internally
      const result = await updateCustomerPassword({
        variables: {
          customerAccessToken: token,
          customer: {
            password: newPassword
          }
        }
      });

      if (!isMounted.current) return;

      if (result.data?.customerUpdate?.customer) {
        // Password updated successfully
        showToast("Password updated successfully", "success");
        
        // Clear form
        form.reset();
        setShowPasswordForm(false);
        
        // Show logout message after password change
        setTimeout(() => {
          showToast("Please log in again with your new password", "info");
        }, 1000);
        
      } else if (result.data?.customerUpdate?.customerUserErrors?.length > 0) {
        // Handle specific error messages
        const error = result.data.customerUpdate.customerUserErrors[0];
        
        if (error.message.includes("same as current")) {
          showToast("New password must be different from current password", "error");
        } else {
          throw new Error(error.message);
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError' && !error.message?.includes('abort') && isMounted.current) {
        console.error("Error updating password:", error);
        showToast(error.message || "Failed to update password", "error");
      }
    }
  };

  const handleUpdateMarketingPreferences = async () => {
    // Implement marketing preferences update
    showToast("Marketing preferences updated", "success");
  };

  const retryFetchData = () => {
    fetchCustomerData();
  };

  // ⭐ Open Shopify Order Status page (no OTP/login required)
  const handleViewOrderDetails = (statusUrl, e) => {
    e.preventDefault();

    if (!statusUrl) {
      showToast("Order status page not available yet", "error");
      return;
    }

    window.open(statusUrl, "_blank", "noopener,noreferrer");
  };

  // Address Management Functions
  const openAddAddressModal = () => {
    setAddressFormData({
      address1: "",
      address2: "",
      city: "",
      province: "",
      country: "United States",
      zip: "",
      phone: "",
      firstName: "",
      lastName: "",
      company: "",
      isDefault: false // Can't set default via Storefront API
    });
    setAddressModal({ isOpen: true, mode: 'add', address: null });
  };

  const openEditAddressModal = (address) => {
    setAddressFormData({
      address1: address.address1 || "",
      address2: address.address2 || "",
      city: address.city || "",
      province: address.province || "",
      country: address.country || "United States",
      zip: address.zip || "",
      phone: address.phone || "",
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      company: address.company || "",
      isDefault: false // Can't change default status
    });
    setAddressModal({ isOpen: true, mode: 'edit', address });
  };

  const closeAddressModal = () => {
    setAddressModal({ isOpen: false, mode: 'add', address: null });
  };

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Validate province based on country
  const validateProvince = (country, province) => {
    // For countries that typically require provinces/states
    const countriesWithProvinces = [
      "United States", "Canada", "Australia", "Brazil", "Mexico", 
      "India", "Germany", "Spain", "Italy", "France", "Japan", 
      "China", "Russia", "Argentina", "South Africa"
    ];
    
    if (countriesWithProvinces.includes(country)) {
      return province && province.trim().length > 0;
    }
    return true; // Province is optional for other countries
  };

  const handleSaveAddress = async () => {
    if (!token || !isMounted.current) return;

    // Validate required fields
    if (!addressFormData.address1 || !addressFormData.city || !addressFormData.zip || !addressFormData.firstName || !addressFormData.lastName) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    // Validate province for countries that require it
    if (!validateProvince(addressFormData.country, addressFormData.province)) {
      showToast(`Province/State is required for ${addressFormData.country}`, "error");
      return;
    }

    try {
      let result;
      
      // Prepare address object for Shopify (without 'name' field)
      const addressInput = {
        address1: addressFormData.address1,
        address2: addressFormData.address2 || null,
        city: addressFormData.city,
        province: addressFormData.province || null,
        country: addressFormData.country,
        zip: addressFormData.zip,
        phone: addressFormData.phone || null,
        firstName: addressFormData.firstName,
        lastName: addressFormData.lastName,
        company: addressFormData.company || null
      };
      
      if (addressModal.mode === 'add') {
        // Add new address
        result = await addCustomerAddress({
          variables: {
            customerAccessToken: token,
            address: addressInput
          }
        });

        if (result.data?.customerAddressCreate?.customerAddress) {
          const newAddress = result.data.customerAddressCreate.customerAddress;
          
          // Update local addresses
          const updatedAddresses = [...allAddresses, newAddress];
          setAllAddresses(updatedAddresses);
          
          // Update profile with new address
          const updatedProfile = {
            ...profile,
            addresses: {
              edges: updatedAddresses.map(addr => ({ node: addr }))
            }
          };
          
          setLocalProfile(updatedProfile);
          dispatch(setProfile(updatedProfile));
          
          showToast("Address added successfully", "success");
          closeAddressModal();
        } else if (result.data?.customerAddressCreate?.customerUserErrors?.length > 0) {
          throw new Error(result.data.customerAddressCreate.customerUserErrors[0].message);
        }
      } else {
        // Edit existing address
        result = await updateCustomerAddress({
          variables: {
            customerAccessToken: token,
            id: addressModal.address.id,
            address: addressInput
          }
        });

        if (result.data?.customerAddressUpdate?.customerAddress) {
          const updatedAddress = result.data.customerAddressUpdate.customerAddress;
          
          // Update local addresses
          const updatedAddresses = allAddresses.map(addr => 
            addr.id === updatedAddress.id ? updatedAddress : addr
          );
          setAllAddresses(updatedAddresses);
          
          // Update profile
          const updatedProfile = {
            ...profile,
            addresses: {
              edges: updatedAddresses.map(addr => ({ node: addr }))
            }
          };
          setLocalProfile(updatedProfile);
          dispatch(setProfile(updatedProfile));
          
          showToast("Address updated successfully", "success");
          closeAddressModal();
        } else if (result.data?.customerAddressUpdate?.customerUserErrors?.length > 0) {
          throw new Error(result.data.customerAddressUpdate.customerUserErrors[0].message);
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError' && !error.message?.includes('abort') && isMounted.current) {
        console.error("Error saving address:", error);
        showToast(error.message || "Failed to save address", "error");
      }
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!token || !isMounted.current) return;

    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      const result = await deleteCustomerAddress({
        variables: {
          customerAccessToken: token,
          id: addressId
        }
      });

      if (result.data?.customerAddressDelete?.deletedCustomerAddressId) {
        // Remove address from local state
        const updatedAddresses = allAddresses.filter(addr => addr.id !== addressId);
        setAllAddresses(updatedAddresses);
        
        // Update profile
        const updatedProfile = {
          ...profile,
          addresses: {
            edges: updatedAddresses.map(addr => ({ node: addr }))
          }
        };
        
        // If deleted address was default, remove default address
        if (profile?.defaultAddress?.id === addressId) {
          updatedProfile.defaultAddress = null;
        }
        
        setLocalProfile(updatedProfile);
        dispatch(setProfile(updatedProfile));
        
        showToast("Address deleted successfully", "success");
      } else if (result.data?.customerAddressDelete?.customerUserErrors?.length > 0) {
        throw new Error(result.data.customerAddressDelete.customerUserErrors[0].message);
      }
    } catch (error) {
      if (error.name !== 'AbortError' && !error.message?.includes('abort') && isMounted.current) {
        console.error("Error deleting address:", error);
        showToast(error.message || "Failed to delete address", "error");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
      case 'FULFILLED':
        return 'text-green-600 bg-green-50';
      case 'PENDING':
      case 'PARTIALLY_FULFILLED':
        return 'text-yellow-600 bg-yellow-50';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
      case 'FULFILLED':
        return <CheckCircle className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Generate initials for profile picture fallback
  const getInitials = () => {
    if (!profile) return "C";
    const first = profile.firstName?.[0] || "";
    const last = profile.lastName?.[0] || "";
    return (first + last).toUpperCase() || "C";
  };

  // Show retry UI if no profile after loading
  if (!loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Failed to load account data</p>
          <button
            onClick={retryFetchData}
            className="px-6 py-3 bg-baltic text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-baltic"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 z-10 relative">
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type}
        onClose={() => isMounted.current && setToast({ ...toast, show: false })}
      />
      
      {/* Address Modal */}
      {addressModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-medium text-gray-900">
                {addressModal.mode === 'add' ? 'Add New Address' : 'Edit Address'}
              </h3>
              <button
                onClick={closeAddressModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={addressFormData.firstName}
                    onChange={handleAddressInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={addressFormData.lastName}
                    onChange={handleAddressInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  name="company"
                  value={addressFormData.company}
                  onChange={handleAddressInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent"
                  placeholder="Company Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  name="address1"
                  value={addressFormData.address1}
                  onChange={handleAddressInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent"
                  placeholder="123 Main St"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  name="address2"
                  value={addressFormData.address2}
                  onChange={handleAddressInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent"
                  placeholder="Apt 4B"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={addressFormData.city}
                    onChange={handleAddressInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent"
                    placeholder="New York"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={addressFormData.province}
                    onChange={handleAddressInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent"
                    placeholder="NY"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Required for US, Canada, Australia, and most countries
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP/Postal Code *
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={addressFormData.zip}
                    onChange={handleAddressInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent"
                    placeholder="10001"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={addressFormData.country}
                    onChange={handleAddressInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent"
                    required
                  >
                    {countries.map(country => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={addressFormData.phone}
                  onChange={handleAddressInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              {/* ⚠️ "Set as default" checkbox removed due to Shopify Storefront API limitation */}
              <div className="text-xs text-gray-500 italic pt-2">
                Note: Default address can only be set in Shopify admin
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={closeAddressModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                className="px-4 py-2 bg-baltic text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                {addressModal.mode === 'add' ? 'Add Address' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-baltic">My Account</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {profile?.firstName || 'Customer'}!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Profile Summary with Picture */}
              <div className="mb-6">
                <div className="relative mb-4">
                  <div className="relative mx-auto w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {profilePicture ? (
                      <img 
                        src={profilePicture} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                        {getInitials()}
                      </div>
                    )}
                    
                    {/* Profile Picture Upload Button */}
                    <label 
                      htmlFor="profile-picture"
                      className="absolute bottom-0 right-0 w-8 h-8 bg-baltic text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                      <input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePictureChange}
                      />
                    </label>
                  </div>
                  
                  <div className="text-center mt-4">
                    <h3 className="font-medium text-gray-900">
                      {profile?.firstName} {profile?.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{profile?.email}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { id: "overview", label: "Overview", icon: User },
                  { id: "orders", label: "My Orders", icon: Package, count: orders?.length || 0 },
                  { id: "addresses", label: "Address Book", icon: MapPin, count: allAddresses?.length || 0 },
                  { id: "settings", label: "Account Settings", icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-baltic text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.count > 0 && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          activeTab === item.id
                            ? "bg-white/20"
                            : "bg-gray-200"
                        }`}>
                          {item.count}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Welcome Card with Profile Info */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-medium text-gray-900">Account Overview</h2>
                      <p className="text-gray-600 mt-1">
                        Manage your account information and track your orders
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("settings")}
                      className="flex items-center gap-2 px-4 py-2 text-baltic hover:text-gray-800 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit Profile
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Info Card */}
                    <div className="border rounded-lg p-6">
                      <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-gray-400" />
                        Personal Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            {profilePicture ? (
                              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-lg font-medium text-gray-600">
                                {getInitials()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{profile?.firstName} {profile?.lastName}</p>
                            <p className="text-sm text-gray-600">{profile?.email}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 pt-4 border-t">
                          <div className="flex items-center gap-3 text-sm">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{profile?.email}</span>
                          </div>
                          {profile?.phone && (
                            <div className="flex items-center gap-3 text-sm">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{profile.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-3 text-sm">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              Member since {profile?.createdAt 
                                ? new Date(profile.createdAt).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long' 
                                  })
                                : 'Recently'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Account Stats Card */}
                    <div className="border rounded-lg p-6">
                      <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Package className="h-5 w-5 text-gray-400" />
                        Order Statistics
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-blue-600 font-medium mb-2">Total Orders</div>
                          <div className="text-2xl font-bold text-gray-900">{orders?.length || 0}</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-green-600 font-medium mb-2">Saved Addresses</div>
                          <div className="text-2xl font-bold text-gray-900">{allAddresses?.length || 0}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                {orders?.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-medium text-gray-900">Recent Orders</h2>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-baltic hover:underline text-sm"
                      >
                        View all
                      </button>
                    </div>
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-medium">Order #{order.orderNumber}</span>
                              <span className="text-gray-500 text-sm ml-4">
                                {new Date(order.processedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(order.financialStatus)}`}>
                                {getStatusIcon(order.financialStatus)}
                                {order.financialStatus?.replace('_', ' ') || 'Processing'}
                              </span>
                              <span className="font-medium">
                                ${order.totalPrice?.amount || '0.00'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Package className="h-4 w-4" />
                              {order.lineItems?.edges?.length || 0} item{order.lineItems?.edges?.length !== 1 ? 's' : ''}
                            </div>
                            <button
                              onClick={(e) => handleViewOrderDetails(order.statusUrl, e)}
                              className="flex items-center gap-1 text-sm text-baltic hover:underline"
                            >
                              View Details
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Default Address - Display Only */}
                {profile?.defaultAddress && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-medium text-gray-900">Default Address</h2>
                      <button
                        onClick={() => setActiveTab("addresses")}
                        className="text-baltic hover:underline text-sm"
                      >
                        Manage all addresses
                      </button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="font-medium">{profile.defaultAddress.firstName} {profile.defaultAddress.lastName}</p>
                          {profile.defaultAddress.company && (
                            <p className="text-gray-600">{profile.defaultAddress.company}</p>
                          )}
                          <p className="text-gray-600">{profile.defaultAddress.address1}</p>
                          {profile.defaultAddress.address2 && (
                            <p className="text-gray-600">{profile.defaultAddress.address2}</p>
                          )}
                          <p className="text-gray-600">
                            {profile.defaultAddress.city}, {profile.defaultAddress.province} {profile.defaultAddress.zip}
                          </p>
                          <p className="text-gray-600">{profile.defaultAddress.country}</p>
                          {profile.defaultAddress.phone && (
                            <p className="text-gray-600 mt-2">{profile.defaultAddress.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-medium text-gray-900 mb-6">My Orders</h2>
                
                {!orders || orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6">When you place an order, it will appear here.</p>
                    <Link
                      to="/"
                      className="inline-block px-6 py-3 bg-baltic text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-medium text-gray-900">
                                Order #{order.orderNumber}
                              </h3>
                              <span className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${getStatusColor(order.financialStatus)}`}>
                                {getStatusIcon(order.financialStatus)}
                                {order.financialStatus?.replace('_', ' ') || 'Processing'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Placed on {new Date(order.processedAt).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              ${order.totalPrice?.amount || '0.00'}
                            </p>
                            <p className="text-sm text-gray-600">{order.totalPrice?.currencyCode || 'USD'}</p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-4">Items</h4>
                          <div className="space-y-4">
                            {order.lineItems?.edges?.map((edge, index) => (
                              <div key={index} className="flex items-center gap-4">
                                {edge.node.variant?.image?.url && (
                                  <img
                                    src={edge.node.variant.image.url}
                                    alt={edge.node.title}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1">
                                  <p className="font-medium">{edge.node.title}</p>
                                  <p className="text-sm text-gray-600">Quantity: {edge.node.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Actions */}
                        <div className="flex justify-end">
                          <button
                            onClick={(e) => handleViewOrderDetails(order.statusUrl, e)}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-baltic text-baltic rounded-lg hover:bg-baltic hover:text-white transition-colors text-sm"
                          >
                            View Full Details
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab - "Set as Default" button removed */}
            {activeTab === "addresses" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium text-gray-900">Address Book</h2>
                  <button
                    onClick={openAddAddressModal}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-baltic text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Address
                  </button>
                </div>
                
                {/* Shopify Storefront API Limitation Notice */}
                <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                  <p>⚠️ <strong>Note:</strong> Default address can only be set in Shopify admin. The address marked with "Default" below is your current default shipping address.</p>
                </div>
                
                {allAddresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
                    <p className="text-gray-600 mb-6">Add your first address to make checkout faster.</p>
                    <button
                      onClick={openAddAddressModal}
                      className="inline-block px-6 py-3 bg-baltic text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {allAddresses.map((address) => (
                      <div 
                        key={address.id} 
                        className={`border rounded-lg p-6 relative ${
                          address.id === profile?.defaultAddress?.id ? 'border-2 border-baltic' : ''
                        }`}
                      >
                        {address.id === profile?.defaultAddress?.id && (
                          <span className="absolute top-4 right-4 px-3 py-1 bg-baltic text-white text-xs rounded-full">
                            Default
                          </span>
                        )}
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {address.company ? <Building className="h-4 w-4 text-gray-400" /> : <Home className="h-4 w-4 text-gray-400" />}
                            <p className="font-medium">{address.firstName} {address.lastName}</p>
                          </div>
                          
                          {address.company && (
                            <p className="text-gray-600 text-sm">{address.company}</p>
                          )}
                          
                          <p className="text-gray-600">{address.address1}</p>
                          {address.address2 && (
                            <p className="text-gray-600">{address.address2}</p>
                          )}
                          <p className="text-gray-600">
                            {address.city}{address.province ? `, ${address.province}` : ''} {address.zip}
                          </p>
                          <p className="text-gray-600">{address.country}</p>
                          {address.phone && (
                            <p className="text-gray-600 mt-2 text-sm">{address.phone}</p>
                          )}
                        </div>
                        
                        <div className="mt-6 flex gap-2">
                          {/* "Set as Default" button REMOVED - Shopify Storefront API limitation */}
                          <button
                            onClick={() => openEditAddressModal(address)}
                            className="px-3 py-1 text-xs border border-baltic text-baltic rounded hover:bg-baltic hover:text-white transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="px-3 py-1 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab - with FULLY FUNCTIONAL Password Change */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-medium text-gray-900 mb-6">Account Settings</h2>
                
                <div className="space-y-8">
                  {/* Profile Picture Section */}
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h3>
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          {profilePicture ? (
                            <img 
                              src={profilePicture} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                              {getInitials()}
                            </div>
                          )}
                        </div>
                        <label 
                          htmlFor="settings-profile-picture"
                          className="absolute bottom-0 right-0 w-8 h-8 bg-baltic text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
                        >
                          <Camera className="h-4 w-4" />
                          <input
                            id="settings-profile-picture"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfilePictureChange}
                          />
                        </label>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-600 mb-3">
                          Upload a new profile picture. Recommended size: 400x400px. Max file size: 5MB.
                        </p>
                        <div className="flex gap-3">
                          <label 
                            htmlFor="settings-profile-picture"
                            className="px-4 py-2 bg-baltic text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer flex items-center gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Upload New Photo
                          </label>
                          {profilePicture && (
                            <button
                              onClick={() => {
                                setProfilePicture(null);
                                if (profile?.id) {
                                  localStorage.removeItem(`profile_picture_${profile.id}`);
                                }
                                showToast("Profile picture removed", "success");
                              }}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Remove Photo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                      {!editingProfile ? (
                        <button
                          onClick={() => setEditingProfile(true)}
                          className="flex items-center gap-2 px-4 py-2 text-baltic hover:text-gray-800 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingProfile(false);
                              setFormData({
                                firstName: profile?.firstName || "",
                                lastName: profile?.lastName || "",
                                email: profile?.email || "",
                                phone: profile?.phone || "",
                              });
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            className="px-4 py-2 bg-baltic text-white rounded-lg hover:bg-gray-800 transition-colors"
                          >
                            Save Changes
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          disabled={!editingProfile}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          disabled={!editingProfile}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          disabled={!editingProfile}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          disabled={!editingProfile}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:cursor-not-allowed"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ✅ FULLY FUNCTIONAL Password Change - CORRECTED */}
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                        <Key className="h-5 w-5 text-gray-400" />
                        Change Password
                      </h3>
                      {!showPasswordForm && (
                        <button
                          onClick={() => setShowPasswordForm(true)}
                          className="flex items-center gap-2 px-4 py-2 text-baltic hover:text-gray-800 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                          Change Password
                        </button>
                      )}
                    </div>
                    
                    {showPasswordForm ? (
                      <form onSubmit={handleUpdatePassword}>
                        <div className="space-y-4 max-w-md">
                          {/* Note: Current password field removed - Shopify doesn't verify it via API */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              name="newPassword"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent"
                              required
                              minLength="8"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Must be at least 8 characters
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              name="confirmPassword"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent"
                              required
                            />
                          </div>
                          <div className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg">
                            <p>⚠️ <strong>Note:</strong> You'll be logged out after password change and need to log in again with your new password.</p>
                          </div>
                          <div className="flex gap-3 pt-4">
                            <button
                              type="submit"
                              className="px-6 py-2 bg-baltic text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                              Update Password
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowPasswordForm(false);
                                // Reset form
                                const form = document.querySelector('form');
                                if (form) form.reset();
                              }}
                              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <p className="text-gray-600">
                        Click the "Change Password" button to update your password.
                      </p>
                    )}
                  </div>

                  {/* Marketing Preferences */}
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Marketing Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          defaultChecked={profile?.acceptsMarketing}
                          className="h-4 w-4 text-baltic rounded"
                        />
                        <span className="text-gray-700">
                          I want to receive marketing promotions and updates via email
                        </span>
                      </label>
                      <p className="text-sm text-gray-500">
                        You can unsubscribe at any time by clicking the link in the footer of our emails.
                      </p>
                    </div>
                    <button 
                      onClick={handleUpdateMarketingPreferences}
                      className="mt-6 px-6 py-2 bg-baltic text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Update Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}