// =====================================
// src/pages/Account.jsx
// PURPOSE:
// Customer account dashboard with profile picture
// Shows orders, profile, address book
// Logout functionality
// =====================================

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { 
  LogOut, Package, User, MapPin, Settings, ChevronRight, 
  Clock, CheckCircle, Camera, Upload, Mail, Phone, 
  Calendar, Shield, Edit2
} from "lucide-react";
import { logout, setProfile, setOrders } from "../features/customer/customerSlice";
import { GET_CUSTOMER_PROFILE, GET_CUSTOMER_ORDERS, UPDATE_CUSTOMER_PROFILE } from "../api/shopify/customer";
import Toast from "../components/Toast";

export default function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
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

  // GraphQL queries and mutations
  const [getCustomerProfile] = useLazyQuery(GET_CUSTOMER_PROFILE);
  const [getCustomerOrders] = useLazyQuery(GET_CUSTOMER_ORDERS);
  const [updateCustomerProfile] = useMutation(UPDATE_CUSTOMER_PROFILE);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchCustomerData();
  }, [token, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      
      // Fetch customer profile and orders in parallel
      const [profileResult, ordersResult] = await Promise.all([
        getCustomerProfile({ 
          variables: { customerAccessToken: token },
          fetchPolicy: 'network-only'
        }),
        getCustomerOrders({ 
          variables: { customerAccessToken: token },
          fetchPolicy: 'network-only'
        })
      ]);

      if (profileResult.data?.customer) {
        const customerData = profileResult.data.customer;
        setLocalProfile(customerData);
        dispatch(setProfile(customerData));
        
        // Try to load profile picture from localStorage
        const savedPicture = localStorage.getItem(`profile_picture_${customerData.id}`);
        if (savedPicture) {
          setProfilePicture(savedPicture);
        }
      }

      if (ordersResult.data?.customer?.orders) {
        const ordersData = ordersResult.data.customer.orders.edges.map(edge => edge.node);
        setLocalOrders(ordersData);
        dispatch(setOrders(ordersData));
      }

    } catch (error) {
      console.error("Error fetching customer data:", error);
      showToast("Failed to load account data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleLogout = () => {
    dispatch(logout());
    showToast("Logged out successfully", "success");
    navigate('/');
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfilePicture(base64String);
        
        // Save to localStorage if we have customer ID
        if (profile?.id) {
          localStorage.setItem(`profile_picture_${profile.id}`, base64String);
        }
        
        showToast("Profile picture updated", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
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
      console.error("Error updating profile:", error);
      showToast(error.message || "Failed to update profile", "error");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
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
    switch (status) {
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
        onClose={() => setToast({ ...toast, show: false })}
      />
      
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
                  { id: "orders", label: "My Orders", icon: Package, count: orders.length },
                  { id: "addresses", label: "Address Book", icon: MapPin },
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
                      {item.count && (
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
                          <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-green-600 font-medium mb-2">Member Since</div>
                          <div className="text-lg font-medium text-gray-900">
                            {profile?.createdAt 
                              ? new Date(profile.createdAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short' 
                                })
                              : 'Recent'
                            }
                          </div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-purple-600 font-medium mb-2">Account Status</div>
                          <div className="flex items-center justify-center gap-1">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span className="text-lg font-medium text-gray-900">Verified</span>
                          </div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <div className="text-yellow-600 font-medium mb-2">Email</div>
                          <div className="text-lg font-medium text-gray-900">Verified</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                {orders.length > 0 && (
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
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Package className="h-4 w-4" />
                            {order.lineItems?.edges?.length || 0} item{order.lineItems?.edges?.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Default Address */}
                {profile?.defaultAddress && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-medium text-gray-900">Default Address</h2>
                      <button
                        onClick={() => setActiveTab("addresses")}
                        className="text-baltic hover:underline text-sm"
                      >
                        Manage
                      </button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="font-medium">{profile.defaultAddress.name}</p>
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
                
                {orders.length === 0 ? (
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
                          <a
                            href={`https://venkat-store-4.myshopify.com/account/orders/${order.orderNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 border border-baltic text-baltic rounded-lg hover:bg-baltic hover:text-white transition-colors text-sm"
                          >
                            View Details on Shopify
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-medium text-gray-900 mb-6">Address Book</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile?.defaultAddress ? (
                    <div className="border-2 border-baltic rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-baltic text-white text-sm rounded-full">
                          Default
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">{profile.defaultAddress.name}</p>
                        <p className="text-gray-600">{profile.defaultAddress.address1}</p>
                        {profile.defaultAddress.address2 && (
                          <p className="text-gray-600">{profile.defaultAddress.address2}</p>
                        )}
                        <p className="text-gray-600">
                          {profile.defaultAddress.city}, {profile.defaultAddress.province} {profile.defaultAddress.zip}
                        </p>
                        <p className="text-gray-600">{profile.defaultAddress.country}</p>
                        {profile.defaultAddress.phone && (
                          <p className="text-gray-600">{profile.defaultAddress.phone}</p>
                        )}
                      </div>
                      <div className="mt-6 flex gap-2">
                        <button className="px-4 py-2 border border-baltic text-baltic rounded-lg hover:bg-baltic hover:text-white transition-colors text-sm">
                          Edit
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                      <MapPin className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-gray-600 mb-4">No default address set</p>
                      <button className="px-4 py-2 bg-baltic text-white rounded-lg hover:bg-gray-800 transition-colors">
                        Add Address
                      </button>
                    </div>
                  )}
                  
                  {/* Add New Address Card */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-baltic transition-colors cursor-pointer">
                    <div className="w-12 h-12 border-2 border-gray-300 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl text-gray-400">+</span>
                    </div>
                    <p className="text-gray-700 font-medium mb-2">Add New Address</p>
                    <p className="text-gray-500 text-sm text-center">
                      Add a new shipping or billing address
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
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

                  {/* Password Change */}
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                    <button className="mt-6 px-6 py-2 bg-baltic text-white rounded-lg hover:bg-gray-800 transition-colors">
                      Update Password
                    </button>
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
                    <button className="mt-6 px-6 py-2 bg-baltic text-white rounded-lg hover:bg-gray-800 transition-colors">
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