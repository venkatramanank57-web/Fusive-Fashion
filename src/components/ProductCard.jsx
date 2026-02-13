// =====================================
// src/components/ProductCard.jsx
// FIXED VERSION - Color variants and hover working properly
// =====================================

import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

// ProductCardSkeleton component - EXPORTED
export function ProductCardSkeleton() {
  return (
    <div className="block no-underline text-inherit w-full">
      <div className="bg-white rounded-lg overflow-hidden animate-pulse">
        <div className="relative overflow-hidden bg-gray-200 aspect-[2/3] md:aspect-[4/5] lg:aspect-[2/3]">
          <div className="w-full h-full bg-gray-300"></div>
        </div>

        <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-3">
          <div className="h-2.5 sm:h-3 w-12 sm:w-16 bg-gray-200 rounded mb-1"></div>
          <div className="h-3 sm:h-4 w-full bg-gray-200 rounded mb-1.5 sm:mb-2"></div>
          <div className="h-3 sm:h-4 w-3/4 bg-gray-200 rounded mb-1.5 sm:mb-2"></div>
          <div className="h-4 sm:h-5 w-20 sm:w-24 bg-gray-300 rounded"></div>
          <div className="mt-1.5 sm:mt-2">
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-200"></div>
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-200"></div>
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
  
  // Debug - log product data to see structure
  useEffect(() => {
    if (product) {
      console.log("Product data:", product);
      console.log("Product variants:", product.variants);
      console.log("Product images:", product.images);
    }
  }, [product]);
  
  // Initialize component
  useEffect(() => {
    if (product) {
      setIsImageLoaded(false);
      
      const defaultImage = product.featuredImage?.url || "";
      defaultImageRef.current = defaultImage;
      setDisplayImage(defaultImage);
      
      // Find second image
      findSecondImage(product);
      
      // Extract color variants
      extractColorVariants(product);
    }
  }, [product]);
  
  // Find second image for hover effect - IMPROVED
  const findSecondImage = (product) => {
    const defaultImage = product.featuredImage?.url || "";
    let secondImg = "";
    
    // Try to get from images array
    if (product.images?.edges && product.images.edges.length > 1) {
      secondImg = product.images.edges[1].node.url;
      console.log("Found second image from images:", secondImg);
    } 
    // Try to get from variants
    else if (product.variants?.edges) {
      for (const { node: variant } of product.variants.edges) {
        if (variant.image?.url && variant.image.url !== defaultImage) {
          secondImg = variant.image.url;
          console.log("Found second image from variant:", secondImg);
          break;
        }
      }
    }
    
    // If no second image found, use default
    secondImageRef.current = secondImg || defaultImage;
    console.log("Second image ref set to:", secondImageRef.current);
  };
  
  // Extract color variants - IMPROVED with more option name checks
  const extractColorVariants = (product) => {
    const colors = [];
    const colorMap = new Map();
    
    console.log("Extracting color variants from product:", product.title);
    
    if (product.variants?.edges) {
      product.variants.edges.forEach(({ node: variant }, index) => {
        console.log(`Variant ${index}:`, variant);
        
        // Check for color in selectedOptions - try different case variations
        const colorOption = variant.selectedOptions?.find(option => {
          const optionName = option.name.toLowerCase();
          return optionName === 'color' || optionName === 'colour' || optionName === 'colors';
        });
        
        console.log(`Variant ${index} color option:`, colorOption);
        
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
            console.log(`Added color variant: ${colorName} with image:`, variant.image.url);
          }
        } else if (variant.image?.url && !colorOption) {
          // If variant has image but no color option, still try to use it
          console.log(`Variant ${index} has image but no color option`);
        }
      });
    }
    
    console.log("Final color variants:", colors);
    setColorVariants(colors);
  };
  
  // Color to hex mapping - EXPANDED
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
      'grey': '#808080',
      'brown': '#A52A2A',
      'navy': '#000080',
      'teal': '#008080',
      'maroon': '#800000',
      'olive': '#808000',
      'silver': '#C0C0C0',
      'gold': '#FFD700',
      'beige': '#F5F5DC',
      'ivory': '#FFFFF0',
      'tan': '#D2B48C',
      'coral': '#FF7F50',
      'lavender': '#E6E6FA',
      'mint': '#98FB98',
      'peach': '#FFE5B4',
    };
    
    return colorMap[colorName.toLowerCase()] || '#CCCCCC';
  };
  
  // Handle mouse enter
  const handleMouseEnter = () => {
    if (selectedColor) return;
    
    setIsHovering(true);
    
    if (secondImageRef.current && secondImageRef.current !== defaultImageRef.current) {
      console.log("Mouse enter - showing second image");
      setDisplayImage(secondImageRef.current);
    }
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsHovering(false);
    
    if (!selectedColor) {
      console.log("Mouse leave - showing default image");
      setDisplayImage(defaultImageRef.current);
    }
  };
  
  // Handle color dot click
  const handleColorClick = (color, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Color clicked:", color);
    
    setIsHovering(false);
    setSelectedColor(color.value);
    setDisplayImage(color.imageUrl);
  };
  
  // Reset to default
  const resetToDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Reset to default");
    
    setIsHovering(false);
    setSelectedColor(null);
    setDisplayImage(defaultImageRef.current);
  };
  
  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    if (selectedColor) return;
    setTouchStart(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    if (selectedColor) return;
    
    const touchMove = e.touches[0].clientX;
    setTouchEnd(touchMove);
    
    // Swipe left - show second image
    if (touchStart - touchMove > 50 && !isHovering) {
      setIsHovering(true);
      if (secondImageRef.current && secondImageRef.current !== defaultImageRef.current) {
        setDisplayImage(secondImageRef.current);
      }
    }
    
    // Swipe right - show default image
    if (touchMove - touchStart > 50 && isHovering) {
      setIsHovering(false);
      setDisplayImage(defaultImageRef.current);
    }
  };
  
  const handleTouchEnd = () => {
    setTouchStart(0);
    setTouchEnd(0);
  };
  
  // Handle image load
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };
  
  if (!product) return null;
  
  // Extract brand from product tags or vendor
  const getBrandFromProduct = () => {
    if (product.vendor) return product.vendor;
    
    if (product.tags && product.tags.length > 0) {
      const brandTags = product.tags.filter(tag => 
        tag.length < 20 && !tag.includes(' ') // Assume brand tags are short and without spaces
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
      {/* MAIN CARD CONTAINER */}
      <div 
        className="bg-white rounded-lg overflow-hidden w-full
                   hover:shadow-md transition-all duration-300 
                   active:scale-[0.98] active:shadow-sm sm:active:scale-100
                   border border-gray-100"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Product Image */}
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
            />
          )}
          
          {/* Mobile swipe indicator - only show if there's a second image */}
          {secondImageRef.current && secondImageRef.current !== defaultImageRef.current && !selectedColor && (
            <div className="sm:hidden absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-70">
              {isHovering ? "← Default" : "Swipe →"}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-3">
          {/* Brand/Vendor */}
          <p className="text-[10px] xs:text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5 sm:mb-1">
            {getBrandFromProduct()}
          </p>
          
          {/* Product Title */}
          <h3 className="font-normal text-gray-900 text-xs sm:text-sm mb-1.5 sm:mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
            {product.title}
          </h3>
          
          {/* Product Price */}
          <p className="text-sm sm:text-base font-medium text-gray-900">
            {formatPrice(product.priceRange?.minVariantPrice?.amount || "0.00")}
          </p>
          
          {/* Color Variants Dots */}
          {colorVariants.length > 0 && (
            <div className="mt-1.5 sm:mt-2">
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {colorVariants.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={(e) => handleColorClick(color, e)}
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all duration-200 
                               hover:scale-110 focus:outline-none
                               ${selectedColor === color.value 
                                 ? 'ring-2 ring-offset-1 ring-gray-800' 
                                 : 'ring-1 ring-gray-300 hover:ring-gray-600'
                               }`}
                    style={{ 
                      backgroundColor: color.displayColor,
                      border: color.displayColor === '#FFFFFF' ? '1px solid #e5e7eb' : 'none'
                    }}
                    title={color.name}
                    aria-label={`Select ${color.name} color`}
                  >
                    {selectedColor === color.value && (
                      <span className="text-[8px] sm:text-[10px] text-white font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Reset Button */}
              {selectedColor && (
                <div className="mt-1.5 sm:mt-2">
                  <button
                    type="button"
                    onClick={resetToDefault}
                    className="text-[10px] sm:text-xs text-gray-500 hover:text-gray-700 hover:underline transition-colors duration-200"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}