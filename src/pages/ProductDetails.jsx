// =====================================
// ProductDetails.jsx
// Fixed: Wishlist and Cart have separate toast notifications
// =====================================

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { ShoppingBag, Heart, HeartOff, Share2, Tag } from "lucide-react";
import { GET_PRODUCT_BY_HANDLE } from "../api/shopify/products";
import { addToCart } from "../features/cart/cartSlice";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import ProductMedia from "../components/ProductMedia";
import Toast from "../components/Toast";

export default function ProductDetails() {
  const { handle } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [variantsMap, setVariantsMap] = useState({});
  const [filteredMedia, setFilteredMedia] = useState([]);

  // Redux state
  const wishlistItems = useSelector((state) => state.wishlist.items);
  
  // GraphQL query
  const { data, loading, error } = useQuery(
    GET_PRODUCT_BY_HANDLE,
    { variables: { handle } }
  );

  // Check if current product variant is in wishlist
  const currentVariantId = selectedVariant?.id || data?.productByHandle?.variants?.edges[0]?.node?.id;
  const isInWishlist = wishlistItems.some(item => 
    item.handle === handle && 
    item.variantId === currentVariantId
  );

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Process product data when loaded
  useEffect(() => {
    if (data?.productByHandle) {
      const product = data.productByHandle;
      
      // Extract all media
      const allMedia = product.media?.edges?.map(e => e.node) || [];
      
      // Extract variants
      const variants = product.variants.edges.map(e => e.node);

      // Extract options from product data
      const options = product.options || [];
      
      // Find color and size options
      const colorOption = options.find(opt => 
        opt.name.toLowerCase().includes('color') || 
        opt.name.toLowerCase().includes('colour')
      );
      
      const sizeOption = options.find(opt => 
        opt.name.toLowerCase().includes('size')
      );

      // Build variants map and extract color images
      const map = {};
      const colorsSet = new Set();
      const sizesSet = new Set();
      const colorImagesMap = {};

      variants.forEach(variant => {
        let colorValue = null;
        let sizeValue = null;

        variant.selectedOptions.forEach(option => {
          if (colorOption && option.name === colorOption.name) {
            colorValue = option.value;
            colorsSet.add(option.value);
          }
          if (sizeOption && option.name === sizeOption.name) {
            sizeValue = option.value;
            sizesSet.add(option.value);
          }
        });

        if (colorValue) {
          if (!map[colorValue]) {
            map[colorValue] = {};
          }
          if (sizeValue) {
            map[colorValue][sizeValue] = variant;
          } else {
            map[colorValue]['default'] = variant;
          }

          // Associate variant image with color
          if (variant.image?.url) {
            if (!colorImagesMap[colorValue]) {
              colorImagesMap[colorValue] = [];
            }
            // Create a media node for this variant image
            const variantMedia = {
              mediaContentType: "IMAGE",
              image: variant.image,
              alt: variant.image.altText || `${product.title} - ${colorValue}`
            };
            colorImagesMap[colorValue].push(variantMedia);
          }
        }
      });

      setVariantsMap(map);
      setAvailableColors(Array.from(colorsSet));
      setAvailableSizes(Array.from(sizesSet));

      // Set initial color and media
      const colorsArray = Array.from(colorsSet);
      if (colorsArray.length > 0) {
        const firstColor = colorsArray[0];
        setSelectedColor(firstColor);
        
        // Set media for selected color
        const colorImages = colorImagesMap[firstColor] || [];
        // Combine color-specific images with other media (videos, etc.)
        const otherMedia = allMedia.filter(media => 
          media.mediaContentType !== "IMAGE" || 
          !colorImages.some(img => img.image?.url === media.image?.url)
        );
        setFilteredMedia([...colorImages, ...otherMedia]);
        
        // Set initial size if available
        const sizesArray = Array.from(sizesSet);
        if (sizesArray.length > 0) {
          const firstAvailableSize = sizesArray.find(size => 
            map[firstColor]?.[size]?.availableForSale
          ) || sizesArray[0];
          setSelectedSize(firstAvailableSize);
          const variant = map[firstColor]?.[firstAvailableSize];
          if (variant) {
            setSelectedVariant(variant);
          }
        } else {
          const variant = map[firstColor]?.['default'] || variants[0];
          if (variant) {
            setSelectedVariant(variant);
          }
        }
      } else {
        // No color options, use all media
        setFilteredMedia(allMedia);
        if (variants.length > 0) {
          setSelectedVariant(variants[0]);
        }
      }
    }
  }, [data]);

  // Handle color change - update media and reset size
  const handleColorChange = (color) => {
    setSelectedColor(color);
    setSelectedSize("");
    
    if (data?.productByHandle) {
      const product = data.productByHandle;
      const allMedia = product.media?.edges?.map(e => e.node) || [];
      const variants = product.variants.edges.map(e => e.node);
      
      // Find variant images for this color
      const colorImages = [];
      variants.forEach(variant => {
        const colorMatch = variant.selectedOptions.find(opt => 
          opt.name.toLowerCase().includes('color') || 
          opt.name.toLowerCase().includes('colour')
        );
        
        if (colorMatch?.value === color && variant.image?.url) {
          colorImages.push({
            mediaContentType: "IMAGE",
            image: variant.image,
            alt: variant.image.altText || `${product.title} - ${color}`
          });
        }
      });
      
      // Combine with other media
      const otherMedia = allMedia.filter(media => 
        media.mediaContentType !== "IMAGE" || 
        !colorImages.some(img => img.image?.url === media.image?.url)
      );
      setFilteredMedia([...colorImages, ...otherMedia]);
      
      // Update selected variant
      if (variantsMap[color]) {
        const sizes = Object.keys(variantsMap[color]);
        if (sizes.length > 0) {
          const firstAvailable = sizes.find(size => 
            variantsMap[color][size]?.availableForSale
          ) || sizes[0];
          setSelectedVariant(variantsMap[color][firstAvailable]);
        } else {
          setSelectedVariant(variantsMap[color]['default']);
        }
      }
    }
  };

  // Handle size change
  const handleSizeChange = (size) => {
    setSelectedSize(size);
    if (selectedColor && variantsMap[selectedColor]?.[size]) {
      setSelectedVariant(variantsMap[selectedColor][size]);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-baltic"></div>
    </div>
  );
  
  if (error) {
    console.error("GraphQL error:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Error loading product: {error.message}</p>
      </div>
    );
  }
  
  if (!data?.productByHandle) return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Product not found</p>
    </div>
  );

  const product = data.productByHandle;
  
  // Get product options
  const options = product.options || [];
  const colorOption = options.find(opt => 
    opt.name.toLowerCase().includes('color') || 
    opt.name.toLowerCase().includes('colour')
  );
  const sizeOption = options.find(opt => 
    opt.name.toLowerCase().includes('size')
  );

  // Check if product has videos
  const hasVideos = filteredMedia.some(media => 
    media.mediaContentType === "VIDEO" || 
    media.mediaContentType === "EXTERNAL_VIDEO"
  );

  // Handle Add to Cart - shows CART toast
  const handleAddToCart = () => {
    if (!selectedVariant) {
      showToast("Please select a variant", "error");
      return;
    }

    if (!selectedVariant.availableForSale) {
      showToast("This variant is out of stock", "error");
      return;
    }

    dispatch(
      addToCart({
        productId: product.id,
        variantId: selectedVariant.id,
        title: product.title,
        price: Number(selectedVariant.price.amount),
        compareAtPrice: selectedVariant.compareAtPrice ? 
          Number(selectedVariant.compareAtPrice.amount) : null,
        quantity: 1,
        image: selectedVariant.image?.url || product.featuredImage?.url || "",
        altText: selectedVariant.image?.altText || product.title,
        size: selectedSize || "",
        color: selectedColor || "",
        handle: product.handle,
      })
    );

    // Show CART toast (different from wishlist toast)
    showToast(
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex-shrink-0">
          <img 
            src={selectedVariant.image?.url || product.featuredImage?.url} 
            alt={product.title}
            className="w-full h-full object-cover rounded"
            onError={(e) => {
              e.target.src = "https://placehold.co/300x400/cccccc/ffffff?text=No+Image";
            }}
          />
        </div>
        <div>
          <p className="font-medium">Added to cart!</p>
          <p className="text-sm opacity-90">{product.title}</p>
          <button
            onClick={() => {
              setToast({ show: false, message: "", type: "success" });
              navigate("/cart");
            }}
            className="mt-2 text-sm underline hover:no-underline text-baltic"
          >
            View cart →
          </button>
        </div>
      </div>,
      "success"
    );
  };

  // Helper function to convert color names to hex values
  const getColorHex = (colorName) => {
    const colorMap = {
      'black': '#000000',
      'white': '#ffffff',
      'red': '#ff0000',
      'blue': '#0000ff',
      'green': '#008000',
      'yellow': '#ffff00',
      'purple': '#800080',
      'pink': '#ffc0cb',
      'orange': '#ffa500',
      'gray': '#808080',
      'grey': '#808080',
      'brown': '#a52a2a',
      'navy': '#000080',
      'burgundy': '#800020',
      'beige': '#f5f5dc',
      'cream': '#fffdd0',
      'khaki': '#f0e68c',
      'maroon': '#800000',
      'olive': '#808000',
      'teal': '#008080',
      'cyan': '#00ffff',
      'magenta': '#ff00ff',
      'silver': '#c0c0c0',
      'gold': '#ffd700',
    };

    return colorMap[colorName?.toLowerCase()] || '#cccccc';
  };

  // Check if variant is available
  const isVariantAvailable = (color, size) => {
    if (color && variantsMap[color]) {
      if (size) {
        const variant = variantsMap[color][size];
        return variant && variant.availableForSale;
      } else {
        const variant = variantsMap[color]['default'];
        return variant && variant.availableForSale;
      }
    }
    return false;
  };

  // Handle Wishlist Toggle - shows WISHLIST toast
  const handleWishlistToggle = () => {
    if (!product) return;

    const wishlistItem = {
      id: product.id,
      handle: product.handle,
      title: product.title,
      price: Number(
        selectedVariant?.price?.amount || 
        product.priceRange?.minVariantPrice?.amount || 
        0
      ),
      image: selectedVariant?.image?.url || product.featuredImage?.url || "",
      color: selectedColor || "",
      size: selectedSize || "",
      variantId: selectedVariant?.id || product.variants?.edges[0]?.node?.id || ""
    };

    // Check if already in wishlist
    const isCurrentlyInWishlist = wishlistItems.some(item => 
      item.handle === wishlistItem.handle && 
      item.variantId === wishlistItem.variantId
    );

    dispatch(toggleWishlist(wishlistItem));

    // Show WISHLIST toast (different from cart toast)
    if (isCurrentlyInWishlist) {
      // Removed from wishlist
      showToast("Removed from wishlist", "info");
    } else {
      // Added to wishlist
      showToast(
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex-shrink-0">
            <img 
              src={wishlistItem.image} 
              alt={product.title}
              className="w-full h-full object-cover rounded"
              onError={(e) => {
                e.target.src = "https://placehold.co/300x400/cccccc/ffffff?text=No+Image";
              }}
            />
          </div>
          <div>
            <p className="font-medium">Added to wishlist!</p>
            <p className="text-sm opacity-90">{product.title}</p>
            <button
              onClick={() => {
                setToast({ show: false, message: "", type: "success" });
                navigate("/wishlist");
              }}
              className="mt-2 text-sm underline hover:no-underline text-baltic"
            >
              View wishlist →
            </button>
          </div>
        </div>,
        "success"
      );
    }
  };

  // Render price with discount
  const renderPrice = () => {
    if (!selectedVariant) return null;
    
    const price = Number(selectedVariant.price.amount);
    const comparePrice = selectedVariant.compareAtPrice ? 
      Number(selectedVariant.compareAtPrice.amount) : null;
    
    if (comparePrice && comparePrice > price) {
      const discount = Math.round((1 - price / comparePrice) * 100);
      return (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-2xl font-medium">
            ₹{price.toLocaleString('en-IN')}
          </span>
          <span className="text-lg text-gray-500 line-through">
            ₹{comparePrice.toLocaleString('en-IN')}
          </span>
          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded">
            {discount}% OFF
          </span>
        </div>
      );
    }
    
    return (
      <span className="text-2xl font-medium">
        ₹{price.toLocaleString('en-IN')}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-white z-10">
      {/* Toast Notification */}
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      {/* Left Column - Media Gallery */}
      <ProductMedia media={filteredMedia} />

      {/* Right Column - Product Details */}
      <div className="p-4 lg:p-8 z-10 bg-white ">
        <div className="max-w-lg mx-auto">
          {/* Top Actions Row */}
          <div className="flex items-center justify-between mb-4">
            {/* Brand/Vendor */}
            {product.vendor && (
              <span className="text-sm font-medium tracking-wider uppercase text-gray-500">
                {product.vendor}
              </span>
            )}
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                className={`p-2 rounded-full transition-all ${
                  isInWishlist
                    ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                    : "text-gray-500 hover:text-red-500 hover:bg-gray-100"
                }`}
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isInWishlist ? (
                  <Heart className="w-5 h-5 fill-current" />
                ) : (
                  <HeartOff className="w-5 h-5" />
                )}
              </button>

              {/* Share Button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast("Link copied to clipboard!", "success");
                }}
                className="p-2 rounded-full text-gray-500 hover:text-baltic hover:bg-gray-100 transition-all"
                aria-label="Share product"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Product Title */}
          <h1 className="text-2xl md:text-3xl font-light mb-2">
            {product.title}
          </h1>

          {/* Product Type/Tags */}
          {(product.productType || product.tags?.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {product.productType && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {product.productType}
                </span>
              )}
              {product.tags?.map(tag => (
                tag !== "best-seller" && (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {tag}
                  </span>
                )
              ))}
              {product.tags?.includes("best-seller") && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                  Best Seller
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="mb-6">
            {renderPrice()}
          </div>

          {/* Color Selection (Conditional - only if colors exist) */}
          {colorOption && availableColors.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <span className="text-sm font-medium mr-3">
                  {colorOption.name}:
                </span>
                <span className="text-sm text-gray-600">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => {
                  const hasAvailableVariants = Object.values(variantsMap[color] || {}).some(v => v?.availableForSale);
                  return (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      disabled={!hasAvailableVariants}
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-baltic ring-2 ring-baltic/20"
                          : "border-transparent"
                      } ${!hasAvailableVariants ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105'}`}
                      style={{
                        backgroundColor: getColorHex(color),
                      }}
                      aria-label={`Select ${color}`}
                      title={`${color}${!hasAvailableVariants ? ' (Out of stock)' : ''}`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selection (Conditional - only if sizes exist) */}
          {sizeOption && availableSizes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">{sizeOption.name}:</span>
                <button className="text-sm text-gray-500 hover:text-baltic underline transition-colors">
                  Size guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => {
                  const isAvailable = isVariantAvailable(selectedColor, size);
                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      disabled={!isAvailable}
                      className={`px-4 py-2 flex items-center justify-center border rounded-md transition-all ${
                        selectedSize === size
                          ? "border-baltic bg-baltic text-white"
                          : isAvailable
                          ? "border-gray-300 hover:border-baltic hover:bg-gray-50"
                          : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <span className="text-sm font-medium">{size}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Out of stock message (Conditional) */}
          {selectedVariant && !selectedVariant.availableForSale && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">
                This variant is currently out of stock
              </p>
            </div>
          )}

          {/* Add to Cart & Buy Now Buttons */}
          <div className="space-y-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || !selectedVariant.availableForSale}
              className={`w-full py-3 px-6 rounded-md transition-all flex items-center justify-center gap-2 ${
                selectedVariant && selectedVariant.availableForSale
                  ? "bg-baltic text-white hover:bg-gray-800 active:scale-[0.98]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <ShoppingBag size={18} />
              {selectedVariant && selectedVariant.availableForSale
                ? "Add to cart"
                : selectedVariant
                ? "Out of stock"
                : "Select options"}
            </button>

            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || !selectedVariant.availableForSale}
              className={`w-full py-3 px-6 rounded-md border transition-all ${
                selectedVariant && selectedVariant.availableForSale
                  ? "border-baltic text-baltic hover:bg-gray-50"
                  : "border-gray-300 text-gray-400 cursor-not-allowed"
              }`}
            >
              Buy Now
            </button>
          </div>

          {/* Product Description (Conditional) */}
          {product.description && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">DESCRIPTION</h3>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>
          )}

          {/* Video Section (Conditional - only if videos exist) */}
          {hasVideos && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">VIDEO</h3>
              <p className="text-sm text-gray-600 mb-3">
                Watch the product in action
              </p>
            </div>
          )}

          {/* Product Details (Conditional) */}
          <div className="border-t border-gray-200 pt-6">
            {/* Product Features */}
            {(product.productType || product.tags?.length > 0) && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">PRODUCT DETAILS</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  {product.productType && (
                    <li className="flex items-start">
                      <span className="mr-2">·</span>
                      <span>Type: {product.productType}</span>
                    </li>
                  )}
                  {product.vendor && (
                    <li className="flex items-start">
                      <span className="mr-2">·</span>
                      <span>Brand: {product.vendor}</span>
                    </li>
                  )}
                  {availableColors.length > 0 && (
                    <li className="flex items-start">
                      <span className="mr-2">·</span>
                      <span>Available in {availableColors.length} colors</span>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Wash & Care (Always shown as it's standard) */}
            <div>
              <h3 className="text-lg font-medium mb-3">CARE INSTRUCTIONS</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Machine wash cold on gentle cycle</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Use mild detergent</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Do not bleach</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Tumble dry low or lay flat to dry</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}