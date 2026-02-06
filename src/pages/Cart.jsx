// =====================================
// src/pages/CartPage.jsx
// PURPOSE:
// Display cart items with proper Shopify checkout
// =====================================

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ShoppingBag, 
  ExternalLink,
  CheckCircle
} from "lucide-react";
import { 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  setCart
} from "../features/cart/cartSlice";
import { CREATE_CART_WITH_ITEMS, ADD_TO_CART } from "../api/shopify/cart";
import Toast from "../components/Toast";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const cart = useSelector((state) => state.cart);
  const cartItems = cart.items;
  const cartId = cart.cartId;
  const checkoutUrl = cart.checkoutUrl;
  
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isCreatingCart, setIsCreatingCart] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  // GraphQL Mutations
  const [createCartWithItemsMutation] = useMutation(CREATE_CART_WITH_ITEMS);
  const [addToCartMutation] = useMutation(ADD_TO_CART);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleQuantityChange = (variantId, newQuantity) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(variantId));
    } else {
      dispatch(updateQuantity({ variantId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (variantId) => {
    if (window.confirm("Remove this item from cart?")) {
      dispatch(removeFromCart(variantId));
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Remove all items from cart?")) {
      dispatch(clearCart());
    }
  };

  // Function to create Shopify cart with all items
  const createShopifyCartWithItems = async () => {
    if (cartItems.length === 0) {
      showToast("Your cart is empty", "error");
      return null;
    }

    setIsCreatingCart(true);
    
    try {
      // Prepare lines for Shopify cart
      const lines = cartItems.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity,
        attributes: item.color || item.size ? [
          ...(item.color ? [{ key: 'Color', value: item.color }] : []),
          ...(item.size ? [{ key: 'Size', value: item.size }] : [])
        ] : undefined
      }));

      console.log("🛒 Creating Shopify cart with items:", lines);

      // Create cart with all items at once
      const result = await createCartWithItemsMutation({
        variables: {
          input: {
            lines: lines
          }
        }
      });

      console.log("📦 Shopify cart creation result:", result);

      if (result.data?.cartCreate?.cart) {
        const cartData = result.data.cartCreate.cart;
        const checkoutUrl = cartData.checkoutUrl;
        
        console.log("✅ Shopify cart created successfully!");
        console.log("🔗 Cart ID:", cartData.id);
        console.log("🔗 Checkout URL:", checkoutUrl);

        // Save cart info to Redux
        dispatch(setCart({
          cartId: cartData.id,
          checkoutUrl: checkoutUrl
        }));

        return checkoutUrl;
      } else if (result.data?.cartCreate?.userErrors?.length > 0) {
        const error = result.data.cartCreate.userErrors[0];
        console.error("❌ Shopify error:", error);
        throw new Error(error.message);
      } else {
        throw new Error("Failed to create cart - no response data");
      }
    } catch (error) {
      console.error("❌ Error creating Shopify cart:", error);
      showToast(error.message || "Failed to create cart", "error");
      return null;
    } finally {
      setIsCreatingCart(false);
    }
  };

  // Function to update existing Shopify cart
  const updateShopifyCart = async () => {
    if (!cartId || cartItems.length === 0) {
      console.log("⚠️ No cartId or empty cart, cannot update");
      return null;
    }
    
    console.log("🔄 Updating existing Shopify cart...");
    console.log("📦 Cart ID:", cartId);
    console.log("📦 Items to update:", cartItems);

    try {
      const lines = cartItems.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity,
        attributes: item.color || item.size ? [
          ...(item.color ? [{ key: 'Color', value: item.color }] : []),
          ...(item.size ? [{ key: 'Size', value: item.size }] : [])
        ] : undefined
      }));

      console.log("📦 Lines payload:", lines);

      const result = await addToCartMutation({
        variables: {
          cartId: cartId,
          lines: lines
        }
      });

      console.log("📝 Shopify update result:", result);

      if (result.data?.cartLinesAdd?.cart) {
        const newCheckoutUrl = result.data.cartLinesAdd.cart.checkoutUrl;
        console.log("✅ Cart updated successfully!");
        console.log("🔗 New checkout URL:", newCheckoutUrl);
        
        // Update checkout URL in Redux
        dispatch(setCart({
          cartId: cartId,
          checkoutUrl: newCheckoutUrl
        }));

        return newCheckoutUrl;
      } else if (result.data?.cartLinesAdd?.userErrors?.length > 0) {
        const error = result.data.cartLinesAdd.userErrors[0];
        console.error("❌ Shopify update error:", error);
        throw new Error(error.message);
      } else {
        console.error("❌ No cart data in update response");
        return checkoutUrl;
      }
    } catch (error) {
      console.error("❌ Error updating Shopify cart:", error);
      // Return existing URL as fallback
      return checkoutUrl;
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      showToast("Your cart is empty", "error");
      return;
    }

    console.log("🚀 Starting checkout process...");
    console.log("📦 Cart items:", cartItems.length);
    console.log("🆔 Current cartId:", cartId);
    console.log("🔗 Current checkoutUrl:", checkoutUrl);

    setIsCheckoutLoading(true);

    try {
      let finalCheckoutUrl = checkoutUrl;

      // If we don't have a cart, create one with all items
      if (!cartId) {
        console.log("🆕 Creating new Shopify cart...");
        finalCheckoutUrl = await createShopifyCartWithItems();
      } else {
        // Update existing cart
        console.log("🔄 Updating existing Shopify cart...");
        finalCheckoutUrl = await updateShopifyCart();
      }

      // Redirect to Shopify checkout
      if (finalCheckoutUrl) {
        console.log("✅ Checkout URL ready:", finalCheckoutUrl);
        console.log("🌐 Redirecting to checkout...");
        
        // Clear the cart after successful checkout initiation
        dispatch(clearCart());
        
        // Redirect to checkout
        window.open(finalCheckoutUrl, '_blank');
      } else {
        console.error("❌ Could not get checkout URL");
        throw new Error("Could not create checkout");
      }
    } catch (error) {
      console.error("❌ Checkout error:", error);
      showToast(error.message || "Failed to proceed to checkout", "error");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handleContinueShopping = () => {
    navigate(-1);
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <Toast 
          show={toast.show} 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-light text-gray-700 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-500 mb-8">
              Add some products to get started
            </p>
            <button
              onClick={handleContinueShopping}
              className="inline-flex items-center gap-2 bg-baltic text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-baltic">Your Shopping Cart</h1>
          <p className="text-gray-500 mt-2">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
          
          {/* Cart Status */}
          <div className="mt-4 flex items-center gap-4">
            {checkoutUrl && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                <CheckCircle size={14} />
                Ready for secure checkout
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2">
            {/* Cart Items List */}
            <div className="bg-white rounded-lg shadow-sm divide-y">
              {cartItems.map((item) => (
                <div key={item.variantId} className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-32 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/300x400/cccccc/ffffff?text=No+Image";
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          {item.handle ? (
                            <Link 
                              to={`/product/${item.handle}`}
                              className="text-lg font-medium text-baltic hover:underline"
                            >
                              {item.title}
                            </Link>
                          ) : (
                            <span className="text-lg font-medium text-baltic">
                              {item.title}
                            </span>
                          )}
                          <div className="mt-1 text-sm text-gray-500 space-y-1">
                            {item.color && <div>Color: {item.color}</div>}
                            {item.size && <div>Size: {item.size}</div>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() => handleQuantityChange(item.variantId, item.quantity - 1)}
                            className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            aria-label="Decrease quantity"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 py-2 text-center min-w-[50px]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.variantId, item.quantity + 1)}
                            className="px-3 py-2 hover:bg-gray-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.variantId)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleClearCart}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
                disabled={isCreatingCart || isCheckoutLoading}
              >
                <Trash2 size={16} />
                Clear Shopping Cart
              </button>
              
              <button
                onClick={handleContinueShopping}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-baltic border border-baltic rounded hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </button>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-medium text-baltic mb-6">
                Order Summary
              </h2>

              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium"}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                {/* Free Shipping Progress */}
                {subtotal < 100 && (
                  <div className="pt-4 border-t">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-600">
                        Free shipping on orders over $100
                      </span>
                      <span className="font-medium text-green-600">
                        ${(100 - subtotal).toFixed(2)} to go
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Including shipping and taxes
                  </p>
                </div>
              </div>

              {/* Checkout Status */}
              <div className="mb-6">
                {checkoutUrl ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                    <p className="text-sm text-green-700 flex items-center gap-2 mb-2">
                      <CheckCircle size={16} />
                      <strong>Ready for checkout!</strong>
                    </p>
                    <p className="text-xs text-green-600">
                      You'll be redirected to secure Shopify checkout in a new tab.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                    <p className="text-sm text-blue-700">
                      <strong>Click "Proceed to Checkout"</strong> to create your Shopify cart and complete your purchase.
                    </p>
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckoutLoading || isCreatingCart}
                className={`w-full py-4 px-6 rounded-md text-white font-medium transition-all flex items-center justify-center gap-2 ${
                  isCheckoutLoading || isCreatingCart
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-baltic hover:bg-gray-800 active:scale-[0.98]"
                }`}
              >
                {isCheckoutLoading || isCreatingCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {isCreatingCart ? "Creating Cart..." : "Redirecting..."}
                  </>
                ) : (
                  <>
                    <ExternalLink size={20} />
                    Proceed to Checkout
                  </>
                )}
              </button>

              {/* Guest Checkout Note */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  No account required • Secure Shopify checkout
                </p>
              </div>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-gray-500 mb-3 text-center">We accept:</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">Visa</span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">Mastercard</span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">PayPal</span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">Shop Pay</span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">Apple Pay</span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">Google Pay</span>
                </div>
              </div>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="w-6 h-6 text-green-600 mx-auto mb-1">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600">Secure</p>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 text-blue-600 mx-auto mb-1">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600">SSL</p>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 text-purple-600 mx-auto mb-1">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600">PCI DSS</p>
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