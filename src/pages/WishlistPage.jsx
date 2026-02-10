// =====================================
// src/pages/WishlistPage.jsx
// PURPOSE:
// Display wishlist items
// Add to cart directly from wishlist
// Remove from wishlist
// =====================================

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowLeft, AlertCircle, Eye } from "lucide-react";
import { addToCart } from "../features/cart/cartSlice";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import Toast from "../components/Toast";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Debug: Log wishlist items to see what data we have
  useEffect(() => {
    console.log("Wishlist items:", wishlistItems);
    wishlistItems.forEach((item, index) => {
      console.log(`Item ${index}:`, {
        id: item.id,
        handle: item.handle,
        title: item.title,
        hasHandle: !!item.handle,
        handleValue: item.handle
      });
    });
  }, [wishlistItems]);

  const handleAddToCart = (item) => {
    // Ensure we have a valid variantId
    const variantId = item.variantId || `${item.id}-default`;
    
    dispatch(
      addToCart({
        productId: item.id,
        variantId: variantId,
        title: item.title,
        price: item.price || 0,
        quantity: 1,
        image: item.image || "https://placehold.co/300x400/cccccc/ffffff?text=No+Image",
        size: item.size || "",
        color: item.color || "",
        handle: item.handle || "",
      })
    );
    
    showToast(`${item.title} added to cart!`, "success");
  };

  const handleRemoveFromWishlist = (item) => {
    dispatch(toggleWishlist(item));
    showToast(`${item.title} removed from wishlist`, "info");
  };

  const handleViewProduct = (item) => {
    console.log("Attempting to view product:", item);
    
    if (item.handle && item.handle !== "undefined" && item.handle.trim() !== "") {
      console.log("Navigating to:", `/product/${item.handle}`);
      navigate(`/product/${item.handle}`);
    } else {
      console.error("Cannot navigate: Invalid handle", item.handle);
      showToast("Cannot view product: Product link is missing or invalid", "error");
    }
  };

  // Filter out invalid items
  const validWishlistItems = wishlistItems.filter(item => 
    item && 
    item.id && 
    item.handle && 
    item.handle !== "undefined" && 
    item.handle.trim() !== ""
  );

  const invalidWishlistItems = wishlistItems.filter(item => 
    !item || 
    !item.id || 
    !item.handle || 
    item.handle === "undefined" || 
    item.handle.trim() === ""
  );

  // Auto-remove invalid items
  useEffect(() => {
    if (invalidWishlistItems.length > 0) {
      invalidWishlistItems.forEach(item => {
        console.log("Auto-removing invalid wishlist item:", item);
        dispatch(toggleWishlist(item));
      });
      showToast(`Removed ${invalidWishlistItems.length} invalid item(s) from wishlist`, "info");
    }
  }, []);

  // Empty wishlist state
  if (validWishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        {/* Toast Notification */}
        <Toast 
          show={toast.show} 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-light text-gray-700 mb-4">
              {wishlistItems.length > 0 ? "Invalid wishlist items" : "Your wishlist is empty"}
            </h1>
            <p className="text-gray-500 mb-8">
              {wishlistItems.length > 0 
                ? "Some items could not be loaded properly and have been removed" 
                : "Save your favorite items here"}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-baltic text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 z-10 relative">
      {/* Toast Notification */}
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-baltic">My Wishlist</h1>
            <p className="text-gray-500 mt-2">
              {validWishlistItems.length} item{validWishlistItems.length !== 1 ? 's' : ''} saved
              {invalidWishlistItems.length > 0 && (
                <span className="text-sm text-red-500 ml-2">
                  ({invalidWishlistItems.length} invalid items removed)
                </span>
              )}
            </p>
          </div>
          
          {/* Clear All Button */}
          {validWishlistItems.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Remove all items from wishlist?")) {
                  validWishlistItems.forEach(item => dispatch(toggleWishlist(item)));
                  showToast("All items removed from wishlist", "info");
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          )}
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {validWishlistItems.map((item) => (
            <div key={`${item.id}-${item.handle}`} className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              {/* Product Image with View Button */}
              <div className="relative">
                <div className="w-full h-64 relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/300x400/cccccc/ffffff?text=No+Image";
                    }}
                  />
                  
                  {/* View Product Overlay */}
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center cursor-pointer"
                    onClick={() => handleViewProduct(item)}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-baltic px-4 py-2 rounded-full flex items-center gap-2">
                      <Eye size={16} />
                      View Product
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="p-2 bg-white rounded-full shadow hover:bg-gray-50 transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                    aria-label="Add to cart"
                    title="Add to cart"
                  >
                    <ShoppingBag size={18} />
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item)}
                    className="p-2 bg-white rounded-full shadow hover:bg-gray-50 transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                    aria-label="Remove from wishlist"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4">
                {/* Product Title with Click Handler */}
                <button
                  onClick={() => handleViewProduct(item)}
                  className="block mb-2 text-left w-full"
                >
                  <h3 className="font-medium text-baltic hover:text-gray-800 line-clamp-2 min-h-[3rem] transition-colors">
                    {item.title}
                  </h3>
                </button>
                
                {/* Variant Info */}
                <div className="text-sm text-gray-500 mb-3 space-y-1">
                  {item.color && item.color.trim() && (
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border border-gray-300" 
                        style={{ backgroundColor: item.color.toLowerCase() === 'black' ? '#000' : 
                                item.color.toLowerCase() === 'red' ? '#f00' : 
                                item.color.toLowerCase() === 'blue' ? '#00f' : 
                                item.color.toLowerCase() === 'green' ? '#0f0' : '#ccc' }} />
                      <span>Color: {item.color}</span>
                    </div>
                  )}
                  {item.size && item.size.trim() && (
                    <div>Size: {item.size}</div>
                  )}
                </div>
                
                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-lg">
                    ${item.price ? item.price.toFixed(2) : "0.00"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewProduct(item)}
                      className="px-3 py-1 border border-baltic text-baltic text-sm rounded hover:bg-baltic hover:text-white transition-colors flex items-center gap-1"
                      title="View product details"
                    >
                      <Eye size={14} />
                      View
                    </button>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="px-3 py-1 bg-baltic text-white text-sm rounded hover:bg-gray-800 transition-colors flex items-center gap-1"
                      title="Add to cart"
                    >
                      <ShoppingBag size={14} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Debug Info:</h3>
            <div className="text-sm text-gray-600">
              <p>Total items: {wishlistItems.length}</p>
              <p>Valid items: {validWishlistItems.length}</p>
              <p>Invalid items: {invalidWishlistItems.length}</p>
              <div className="mt-2">
                <p className="font-medium">Valid items details:</p>
                {validWishlistItems.map((item, index) => (
                  <div key={index} className="ml-2">
                    {index + 1}. {item.title} - Handle: "{item.handle}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats and Continue Shopping */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            <p>Total value: <span className="font-medium text-lg">
              ${validWishlistItems.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2)}
            </span></p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-baltic hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>
            
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 bg-baltic text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm"
            >
              <ShoppingBag size={16} />
              Go to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}