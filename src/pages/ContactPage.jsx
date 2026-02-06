// =====================================
// src/pages/ContactPage.jsx
// PURPOSE:
// Contact page using Shopify store info
// =====================================

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle,
  MessageSquare,
  Home,
  ChevronLeft
} from "lucide-react";
import { GET_SHOP_CONTACT } from "../api/shopify/policies";
import Toast from "../components/Toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const { data, loading, error } = useQuery(GET_SHOP_CONTACT);

  const shopInfo = data?.shop;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Here you would typically send to your backend
    // For demo, we'll just show success
    setTimeout(() => {
      setIsSubmitting(false);
      setToast({
        show: true,
        message: "Message sent successfully! We'll reply within 24 hours.",
        type: "success"
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }, 1500);
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-baltic"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-baltic hover:text-gray-800 transition-colors"
              >
                <ChevronLeft size={20} />
                Back to Home
              </Link>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div>
                <h1 className="text-3xl font-light text-gray-900">Contact Us</h1>
                <p className="text-gray-600 mt-2">
                  Get in touch with {shopInfo?.name || 'our team'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Store Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-6">Store Information</h2>
              
              <div className="space-y-6">
                {shopInfo?.name && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Store Name</h3>
                    <p className="text-gray-600">{shopInfo.name}</p>
                  </div>
                )}
                
                {shopInfo?.description && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">About Us</h3>
                    <p className="text-gray-600">{shopInfo.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-6">Contact Details</h2>
              
              <div className="space-y-6">
                {/* Email */}
                {shopInfo?.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                      <a 
                        href={`mailto:${shopInfo.email}`}
                        className="text-baltic hover:underline"
                      >
                        {shopInfo.email}
                      </a>
                      <p className="text-sm text-gray-500 mt-1">Typically replies within 24 hours</p>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {shopInfo?.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Phone</h3>
                      <a 
                        href={`tel:${shopInfo.phone.replace(/\D/g, '')}`}
                        className="text-baltic hover:underline"
                      >
                        {shopInfo.phone}
                      </a>
                      <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9AM-6PM EST</p>
                    </div>
                  </div>
                )}

                {/* Address */}
                {shopInfo?.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Address</h3>
                      <p className="text-gray-600">
                        {shopInfo.address.address1}
                        {shopInfo.address.address2 && <br />}
                        {shopInfo.address.address2}
                        <br />
                        {shopInfo.address.city}, {shopInfo.address.province} {shopInfo.address.zip}
                        <br />
                        {shopInfo.address.country}
                      </p>
                    </div>
                  </div>
                )}

                {/* Business Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Business Hours</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                      <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link
                  to="/policy/refund"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <span className="text-green-600">↻</span>
                  <div>
                    <p className="font-medium">Refund Policy</p>
                    <p className="text-sm text-gray-500">Our return procedures</p>
                  </div>
                </Link>
                
                <Link
                  to="/policy/shipping"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <span className="text-blue-600">🚚</span>
                  <div>
                    <p className="font-medium">Shipping Info</p>
                    <p className="text-sm text-gray-500">Delivery times & costs</p>
                  </div>
                </Link>
                
                <a
                  href={`https://${import.meta.env.VITE_SHOPIFY_DOMAIN}/pages/faq`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <span className="text-purple-600">❓</span>
                  <div>
                    <p className="font-medium">FAQ</p>
                    <p className="text-sm text-gray-500">Common questions</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-baltic rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-light text-gray-900">Send us a message</h2>
                  <p className="text-gray-600 mt-1">
                    Fill out the form below and we'll get back to you as soon as possible
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baltic focus:border-transparent resize-none"
                    placeholder="Please describe your inquiry in detail..."
                  />
                </div>

                {/* Form Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-700">
                        <strong>Tip:</strong> For faster assistance with orders, please include your order number.
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        Response time: Typically within 24 hours during business days.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t">
                  <p className="text-sm text-gray-500">
                    * Required fields
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-baltic text-white hover:bg-gray-800 active:scale-[0.98]"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Alternative Contact */}
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Prefer to contact us directly?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {shopInfo?.email && (
                    <a
                      href={`mailto:${shopInfo.email}`}
                      className="p-4 border rounded-lg hover:border-baltic transition-colors flex items-center gap-3"
                    >
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Send Email</p>
                        <p className="text-sm text-gray-600">Direct to our inbox</p>
                      </div>
                    </a>
                  )}
                  
                  {shopInfo?.phone && (
                    <a
                      href={`tel:${shopInfo.phone.replace(/\D/g, '')}`}
                      className="p-4 border rounded-lg hover:border-baltic transition-colors flex items-center gap-3"
                    >
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Call Us</p>
                        <p className="text-sm text-gray-600">Speak directly with support</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>

              {/* Shopify API Info */}
              <div className="mt-8 pt-6 border-t">
                <p className="text-xs text-gray-500 text-center">
                  Store information fetched from Shopify API • 
                  Domain: {import.meta.env.VITE_SHOPIFY_DOMAIN} • 
                  Last sync: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}