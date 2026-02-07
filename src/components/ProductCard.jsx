// =====================================
// src/components/ProductCard.jsx
// INCLUDES SKELETON LOADER
// =====================================

import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

// ProductCardSkeleton component - EXPORTED
export function ProductCardSkeleton() {
  return (
    <div className="block no-underline text-inherit w-full">
      {/* MAIN CARD CONTAINER - MATCHES ProductCard EXACTLY */}
      <div className="bg-white rounded-lg overflow-hidden animate-pulse">
        {/* Product Image Skeleton - Responsive aspect ratio */}
        <div className="relative overflow-hidden bg-gray-200 aspect-[2/3] md:aspect-[4/5] lg:aspect-[2/3]">
          {/* Image placeholder - exact same dimensions as real image */}
          <div className="w-full h-full bg-gray-300"></div>
        </div>

        {/* Product Info Skeleton - TEXT LEFT ALIGNED, EXACTLY LIKE REAL CARD */}
        <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-3">
          {/* Brand/Vendor Skeleton (small text at top) */}
          <div className="h-2.5 sm:h-3 w-12 sm:w-16 bg-gray-200 rounded mb-1"></div>
          
          {/* Product Title Skeleton (main title) */}
          <div className="h-3 sm:h-4 w-full bg-gray-200 rounded mb-1.5 sm:mb-2"></div>
          <div className="h-3 sm:h-4 w-3/4 bg-gray-200 rounded mb-1.5 sm:mb-2"></div>
          
          {/* Product Price Skeleton */}
          <div className="h-4 sm:h-5 w-20 sm:w-24 bg-gray-300 rounded"></div>
          
          {/* Color Variants Dots Skeleton - Shows 3 color dots */}
          <div className="mt-1.5 sm:mt-2">
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {/* First color dot */}
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-200"></div>
              {/* Second color dot */}
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-200"></div>
              {/* Third color dot */}
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main ProductCard component - DEFAULT EXPORT
export default function ProductCard({ product }) {
  // State for managing images and selected color
  const [displayImage, setDisplayImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Extract unique colors from variants
  const [colorVariants, setColorVariants] = useState([]);
  
  // Refs for image URLs
  const defaultImageRef = useRef("");
  const secondImageRef = useRef("");
  
  // State for touch interactions
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  // Initialize component
  useEffect(() => {
    if (product) {
      setIsImageLoaded(false);
      
      const defaultImage = product.featuredImage?.url || "";
      defaultImageRef.current = defaultImage;
      setDisplayImage(defaultImage);
      
      // Find second image
      const allImages = product.images?.edges || [];
      let secondImg = "";
      
      if (allImages.length > 1) {
        secondImg = allImages[1].node.url;
      } else if (product.variants?.edges) {
        for (const { node: variant } of product.variants.edges) {
          if (variant.image?.url && variant.image.url !== defaultImage) {
            secondImg = variant.image.url;
            break;
          }
        }
      }
      
      secondImg = secondImg || defaultImage;
      secondImageRef.current = secondImg;
      
      extractColorVariants(product);
    }
  }, [product]);
  
  // Extract color variants
  const extractColorVariants = (product) => {
    const colors = [];
    const colorMap = new Map();
    
    if (product.variants?.edges) {
      product.variants.edges.forEach(({ node: variant }) => {
        const colorOption = variant.selectedOptions?.find(
          option => option.name.toLowerCase() === 'color'
        );
        
        if (colorOption && variant.image?.url) {
          const colorName = colorOption.value;
          const colorValue = colorName.toLowerCase();
          
          if (!colorMap.has(colorValue)) {
            colorMap.set(colorValue, true);
            colors.push({
              name: colorName,
              value: colorValue,
              imageUrl: variant.image.url,
              displayColor: getColorHex(colorName)
            });
          }
        }
      });
    }
    
    setColorVariants(colors);
  };
  
  // Color to hex mapping
  const getColorHex = (colorName) => {
    const colorMap = {
      'black': '#000000',
      'white': '#FFFFFF',
      'red': '#FF0000',
      'blue': '#0000FF',
      'green': '#00FF00',
      'yellow': '#FFFF00',
      'pink': '#FFC0CB',
      'purple': '#800080',
      'orange': '#FFA500',
      'gray': '#808080',
      'brown': '#A52A2A',
      'navy': '#000080',
      'teal': '#008080',
      'maroon': '#800000',
      'olive': '#808000',
      'silver': '#C0C0C0',
      'gold': '#FFD700',
    };
    
    return colorMap[colorName.toLowerCase()] || '#CCCCCC';
  };
  
  // Handle mouse enter
  const handleMouseEnter = () => {
    if (selectedColor) return;
    
    setIsHovering(true);
    
    if (secondImageRef.current && secondImageRef.current !== defaultImageRef.current) {
      setDisplayImage(secondImageRef.current);
    }
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsHovering(false);
    
    if (!selectedColor) {
      setDisplayImage(defaultImageRef.current);
    }
  };
  
  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    if (selectedColor) return;
    
    const touchDown = e.touches[0].clientX;
    setTouchStart(touchDown);
  };
  
  const handleTouchMove = (e) => {
    if (selectedColor) return;
    
    const touchUp = e.touches[0].clientX;
    setTouchEnd(touchUp);
    
    // If user swiped left (showing second image)
    if (touchStart - touchEnd > 50 && !isHovering) {
      setIsHovering(true);
      if (secondImageRef.current && secondImageRef.current !== defaultImageRef.current) {
        setDisplayImage(secondImageRef.current);
      }
    }
    
    // If user swiped right (showing default image)
    if (touchEnd - touchStart > 50 && isHovering) {
      setIsHovering(false);
      setDisplayImage(defaultImageRef.current);
    }
  };
  
  const handleTouchEnd = () => {
    setTouchStart(0);
    setTouchEnd(0);
  };
  
  // Handle color dot click
  const handleColorClick = (color, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsHovering(false);
    setSelectedColor(color.value);
    setDisplayImage(color.imageUrl);
  };
  
  // Reset to default
  const resetToDefault = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setIsHovering(false);
    setSelectedColor(null);
    setDisplayImage(defaultImageRef.current);
  };
  
  // Handle image load
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };
  
  if (!product) return null;
  
  // Extract brand from product tags or vendor
  const getBrandFromProduct = () => {
    if (product.vendor) return product.vendor;
    
    // Try to extract brand from tags
    if (product.tags && product.tags.length > 0) {
      const brandTags = product.tags.filter(tag => 
        ['MOE', 'Nike', 'Adidas', 'Zara', 'H&M'].includes(tag.toUpperCase())
      );
      if (brandTags.length > 0) return brandTags[0];
    }
    
    return "BRAND";
  };
  
  // Format price with Rs. prefix
  const formatPrice = (amount) => {
    return `Rs. ${parseFloat(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };
  
  return (
    <Link 
      to={`/products/${product.handle}`} 
      className="block no-underline text-inherit z-10 w-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* MAIN CARD CONTAINER - Responsive padding and hover effects */}
      <div 
        className="bg-white rounded-lg overflow-hidden w-full
                   hover:shadow-md transition-all duration-300 
                   active:scale-[0.98] active:shadow-sm sm:active:scale-100
                   border border-gray-100"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Product Image - Responsive aspect ratio */}
        <div className="relative overflow-hidden bg-gray-50 
                       aspect-[2/3] md:aspect-[4/5] lg:aspect-[2/3]">
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
          )}
          
          {displayImage && (
            <img
              src={displayImage}
              alt={product.featuredImage?.altText || product.title}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            />
          )}
          
          {/* Mobile swipe indicator */}
          <div className="sm:hidden absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-70">
            {isHovering ? "← Swipe back" : "Swipe →"}
          </div>
        </div>

        {/* Product Info - Responsive padding and text sizes */}
        <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-3">
          {/* Brand/Vendor (small text at top) */}
          <p className="text-[10px] xs:text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5 sm:mb-1">
            {getBrandFromProduct()}
          </p>
          
          {/* Product Title (main title) */}
          <h3 className="font-normal text-gray-900 text-xs sm:text-sm mb-1.5 sm:mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
            {product.title}
          </h3>
          
          {/* Product Price */}
          <p className="text-sm sm:text-base font-medium text-gray-900">
            {formatPrice(product.priceRange?.minVariantPrice?.amount || "0.00")}
          </p>
          
          {/* Color Variants Dots - Only show if available */}
          {colorVariants.length > 0 && (
            <div className="mt-1.5 sm:mt-2">
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {colorVariants.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={(e) => handleColorClick(color, e)}
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all duration-200 flex items-center justify-center
                      ${selectedColor === color.value 
                        ? 'ring-1 ring-gray-800' 
                        : 'ring-1 ring-gray-200 hover:ring-gray-400'
                      }`}
                    style={{ backgroundColor: color.displayColor }}
                    title={color.name}
                    aria-label={`Select ${color.name} color`}
                  >
                    {selectedColor === color.value && (
                      <span className="text-[8px] sm:text-[10px] text-white font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Reset Button - Only show on hover or when color selected */}
          {selectedColor && (
            <div className="mt-1.5 sm:mt-2">
              <button
                type="button"
                onClick={resetToDefault}
                className="text-[10px] sm:text-xs text-gray-500 hover:text-gray-700 hover:underline transition-colors duration-200"
                aria-label="Reset to default image"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}