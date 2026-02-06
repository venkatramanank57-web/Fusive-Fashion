// =====================================
// src/pages/PoliciesPage.jsx
// PURPOSE: Dynamic policy page that fetches from Shopify API
// =====================================

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Shield, 
  RefreshCw, 
  FileText, 
  Truck, 
  Mail, 
  ChevronLeft,
  AlertCircle,
  ExternalLink,
  CheckCircle,
  Info,
  Loader2
} from "lucide-react";
import { GET_SHOP_POLICIES } from "../api/shopify/policies";

export default function PoliciesPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  
  const [policy, setPolicy] = useState(null);
  const [shopInfo, setShopInfo] = useState(null);
  
  // Debug logging
  useEffect(() => {
    console.log("🔍 Policies Page Debug:");
    console.log("Domain:", import.meta.env.VITE_SHOPIFY_DOMAIN);
    console.log("Token exists:", !!import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN);
    console.log("Policy type:", type);
  }, []);

  // Apollo query for Shopify data
  const { data, loading, error } = useQuery(GET_SHOP_POLICIES, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log("✅ Shopify API Response:", data);
    },
    onError: (error) => {
      console.error("❌ Shopify API Error:", error);
    }
  });

  // Policy configuration
  const policyConfig = {
    privacy: {
      title: "Privacy Policy",
      icon: Shield,
      color: "blue",
      description: "How we protect your personal information",
      shopifyField: "privacyPolicy"
    },
    refund: {
      title: "Refund & Return Policy",
      icon: RefreshCw,
      color: "green",
      description: "Our return and refund procedures",
      shopifyField: "refundPolicy"
    },
    terms: {
      title: "Terms of Service",
      icon: FileText,
      color: "purple",
      description: "Terms and conditions of use",
      shopifyField: "termsOfService"
    },
    shipping: {
      title: "Shipping Policy",
      icon: Truck,
      color: "yellow",
      description: "Delivery times and shipping methods",
      shopifyField: "shippingPolicy"
    }
  };

  const currentPolicy = policyConfig[type];

  // Process Shopify data when loaded
  useEffect(() => {
    if (!currentPolicy) {
      navigate('/');
      return;
    }
    
    if (data?.shop) {
      setShopInfo(data.shop);
      
      // Get specific policy from Shopify response
      const policyData = data.shop[currentPolicy.shopifyField];
      
      if (policyData && policyData.body) {
        setPolicy(policyData);
      } else {
        // Fallback to default content if Shopify doesn't have policy
        setPolicy({
          title: currentPolicy.title,
          body: getDefaultPolicy(type),
          url: `https://${import.meta.env.VITE_SHOPIFY_DOMAIN}/policies/${type}-policy`
        });
      }
    }
  }, [data, type, currentPolicy, navigate]);

  // Default policy content (fallback)
  const getDefaultPolicy = (policyType) => {
    const storeName = shopInfo?.name || "our store";
    
    const defaults = {
      privacy: `
        <div class="prose prose-lg max-w-none">
          <h2>Privacy Policy</h2>
          <p>Your privacy is important to us at ${storeName}. We are committed to protecting your personal information.</p>
          
          <h3>Information We Collect</h3>
          <p>We collect information that you provide directly to us:</p>
          <ul>
            <li>Name and contact information</li>
            <li>Shipping and billing addresses</li>
            <li>Payment information (processed securely)</li>
            <li>Order history and preferences</li>
          </ul>
          
          <h3>How We Use Your Information</h3>
          <p>Your information helps us:</p>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Communicate about orders and products</li>
            <li>Improve our website and services</li>
            <li>Send marketing communications (with consent)</li>
          </ul>
          
          <h3>Data Security</h3>
          <p>We implement industry-standard security measures to protect your data. All transactions are encrypted.</p>
          
          <div class="bg-blue-50 p-4 rounded-lg mt-6">
            <p class="text-sm text-blue-700">
              <strong>Note:</strong> This is a default policy. The official policy can be viewed and edited in Shopify Admin.
            </p>
          </div>
          
          <p class="mt-6 text-gray-600">
            <em>Last updated: ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</em>
          </p>
        </div>
      `,
      refund: `
        <div class="prose prose-lg max-w-none">
          <h2>Refund & Return Policy</h2>
          <p>We want you to be completely satisfied with your purchase from ${storeName}.</p>
          
          <h3>Return Window</h3>
          <p>Most items can be returned within 30 days of delivery. Items must be:</p>
          <ul>
            <li>In original condition</li>
            <li>Unworn, unused, and unwashed</li>
            <li>With original tags and packaging</li>
            <li>Accompanied by proof of purchase</li>
          </ul>
          
          <h3>Return Process</h3>
          <ol>
            <li>Contact our customer service for a Return Authorization (RMA)</li>
            <li>Pack items securely with the RMA number visible</li>
            <li>Ship to our return address (provided with RMA)</li>
            <li>Once received, we'll process your refund within 5-10 business days</li>
          </ol>
          
          <h3>Refunds</h3>
          <p>Refunds are issued to your original payment method. Shipping costs are non-refundable unless the return is due to our error.</p>
          
          <h3>Non-Returnable Items</h3>
          <ul>
            <li>Gift cards</li>
            <li>Personalized or custom items</li>
            <li>Items marked as final sale</li>
            <li>Hygiene products (if opened)</li>
          </ul>
          
          <div class="bg-green-50 p-4 rounded-lg mt-6">
            <p class="text-sm text-green-700">
              <strong>Tip:</strong> For faster service, include your order number in all communications.
            </p>
          </div>
          
          <p class="mt-6 text-gray-600">
            <em>Last updated: ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</em>
          </p>
        </div>
      `,
      terms: `
        <div class="prose prose-lg max-w-none">
          <h2>Terms of Service</h2>
          <p>Welcome to ${storeName}! By using our website, you agree to these terms.</p>
          
          <h3>Acceptance of Terms</h3>
          <p>By accessing and using this website, you accept and agree to be bound by these Terms of Service.</p>
          
          <h3>Use License</h3>
          <p>Permission is granted to temporarily access the materials on our website for personal, non-commercial transitory viewing only.</p>
          
          <h3>User Accounts</h3>
          <p>When you create an account, you are responsible for:</p>
          <ul>
            <li>Maintaining account security</li>
            <li>All activities under your account</li>
            <li>Keeping your information current</li>
          </ul>
          
          <h3>Product Information</h3>
          <p>We strive for accuracy in product descriptions and pricing. However, we do not warrant that descriptions, prices, or other content is error-free.</p>
          
          <h3>Order Acceptance</h3>
          <p>We reserve the right to refuse or cancel any order for any reason, including:</p>
          <ul>
            <li>Product availability</li>
            <li>Errors in pricing or description</li>
            <li>Suspected fraud</li>
          </ul>
          
          <h3>Limitation of Liability</h3>
          <p>${storeName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
          
          <p class="mt-6 text-gray-600">
            <em>Last updated: ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</em>
          </p>
        </div>
      `,
      shipping: `
        <div class="prose prose-lg max-w-none">
          <h2>Shipping Policy</h2>
          <p>Thank you for shopping with ${storeName}! Here's everything you need to know about shipping.</p>
          
          <h3>Processing Time</h3>
          <p>Orders are processed within 1-2 business days (Monday-Friday, excluding holidays).</p>
          
          <h3>Shipping Methods & Times</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border border-gray-300 p-3 text-left">Service</th>
                  <th class="border border-gray-300 p-3 text-left">Delivery Time</th>
                  <th class="border border-gray-300 p-3 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-gray-300 p-3">Standard Shipping</td>
                  <td class="border border-gray-300 p-3">5-10 business days</td>
                  <td class="border border-gray-300 p-3">Free on orders over $100</td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="border border-gray-300 p-3">Express Shipping</td>
                  <td class="border border-gray-300 p-3">2-5 business days</td>
                  <td class="border border-gray-300 p-3">Additional charges apply</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 p-3">International</td>
                  <td class="border border-gray-300 p-3">7-21 business days</td>
                  <td class="border border-gray-300 p-3">Customs fees may apply</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h3>Shipping Costs</h3>
          <p>Shipping costs are calculated at checkout based on:</p>
          <ul>
            <li>Destination</li>
            <li>Package weight and dimensions</li>
            <li>Selected shipping method</li>
          </ul>
          
          <h3>Order Tracking</h3>
          <p>You will receive tracking information via email once your order ships.</p>
          
          <h3>Shipping Restrictions</h3>
          <p>Some items cannot be shipped to certain locations due to restrictions.</p>
          
          <h3>Lost or Damaged Packages</h3>
          <p>Contact us immediately if your package is lost or arrives damaged.</p>
          
          <div class="bg-yellow-50 p-4 rounded-lg mt-6">
            <p class="text-sm text-yellow-700">
              <strong>Important:</strong> Please verify your shipping address before placing your order.
            </p>
          </div>
          
          <p class="mt-6 text-gray-600">
            <em>Last updated: ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</em>
          </p>
        </div>
      `
    };
    
    return defaults[policyType] || defaults.privacy;
  };

  // Utility functions
  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200'
    };
    return colors[color] || colors.blue;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-baltic animate-spin mr-3" />
            <span className="text-gray-600">Loading policy from Shopify...</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Fetching from: {import.meta.env.VITE_SHOPIFY_DOMAIN}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2 text-center">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Unable to fetch policy from Shopify
          </p>
          <div className="space-y-3">
            <a
              href={`https://${import.meta.env.VITE_SHOPIFY_DOMAIN}/policies/${type}-policy`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-baltic text-white py-3 rounded-lg hover:bg-gray-800 transition-colors text-center"
            >
              View on Shopify
            </a>
            <Link
              to="/"
              className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Invalid policy type
  if (!currentPolicy) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-baltic hover:text-gray-800 transition-colors"
            >
              <ChevronLeft size={20} />
              Back to Home
            </Link>
            
            <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
            
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColorClasses(currentPolicy.color)}`}>
                <currentPolicy.icon className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-light text-gray-900">
                  {policy?.title || currentPolicy.title}
                </h1>
                <p className="text-sm text-gray-600">
                  {currentPolicy.description}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a
              href={`https://${import.meta.env.VITE_SHOPIFY_DOMAIN}/policies/${type}-policy`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink size={14} />
              View on Shopify
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Store Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-gray-400" />
                Store Information
              </h3>
              
              {shopInfo ? (
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-900">{shopInfo.name}</p>
                    {shopInfo.description && (
                      <p className="text-sm text-gray-600 mt-1">{shopInfo.description}</p>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                      <CheckCircle size={14} />
                      Connected to Shopify
                    </div>
                    <p className="text-xs text-gray-500">
                      API: {import.meta.env.VITE_SHOPIFY_API_VERSION}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Loading store info...</p>
              )}
            </div>

            {/* Policy Navigation */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium text-gray-900 mb-4">All Policies</h3>
              
              <nav className="space-y-2">
                {Object.entries(policyConfig).map(([key, config]) => (
                  <Link
                    key={key}
                    to={`/policy/${key}`}
                    className={`block px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                      type === key
                        ? 'bg-baltic text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <config.icon className="h-5 w-5" />
                    <span>{config.title}</span>
                  </Link>
                ))}
              </nav>

              {/* Contact Link */}
              <Link
                to="/contact"
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3 mt-6 border-t pt-4"
              >
                <Mail className="h-5 w-5" />
                <span>Contact Us</span>
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Policy Content */}
              <div className="p-6 md:p-8">
                {policy?.body ? (
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: policy.body }}
                  />
                ) : (
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: getDefaultPolicy(type) }}
                  />
                )}

                {/* Source Info */}
                <div className="mt-8 pt-6 border-t">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {policy?.body ? '✅' : '📝'}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        {policy?.body ? 'Fetched from Shopify' : 'Default Policy Content'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {policy?.body 
                          ? 'This policy is automatically synced from your Shopify store.'
                          : 'Set up your official policy in Shopify Admin.'
                        }
                      </p>
                      <a
                        href={`https://${import.meta.env.VITE_SHOPIFY_DOMAIN}/admin/settings/legal`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-baltic hover:underline mt-2"
                      >
                        {policy?.body ? 'Edit in Shopify Admin' : 'Set up in Shopify Admin'}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 p-6 border-t">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Questions?</h4>
                    <p className="text-sm text-gray-600">
                      Contact our support team for assistance
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {shopInfo?.email && (
                      <a
                        href={`mailto:${shopInfo.email}`}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        Email Support
                      </a>
                    )}
                    <Link
                      to="/contact"
                      className="px-4 py-2 bg-baltic text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                    >
                      Contact Form
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}