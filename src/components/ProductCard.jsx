// =====================================
// src/components/ProductCard.jsx
// FIXED - No flicker when resetting images
// =====================================

import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function ProductCard({ product }) {
  // State for managing images and selected color
  const [displayImage, setDisplayImage] = useState("");
  const [secondImage, setSecondImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Extract unique colors from variants
  const [colorVariants, setColorVariants] = useState([]);
  
  // Refs for image URLs to prevent dependency issues
  const defaultImageRef = useRef("");
  const secondImageRef = useRef("");
  
  // Initialize component with product data
  useEffect(() => {
    if (product) {
      // Reset loading state
      setIsImageLoaded(false);
      
      // Set default (first/main) image
      const defaultImage = product.featuredImage?.url || "";
      defaultImageRef.current = defaultImage;
      setDisplayImage(defaultImage);
      
      // Find second image for hover effect
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
      setSecondImage(secondImg);
      
      // Extract unique colors from variants
      extractColorVariants(product);
    }
  }, [product]);
  
  // Extract color variants function
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
  
  // Helper function to convert color names to hex values
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
  
  // Handle mouse enter for hover effect
  const handleMouseEnter = () => {
    if (selectedColor) return; // Don't hover if color is selected
    
    setIsHovering(true);
    
    // Change to second image on hover
    if (secondImageRef.current && secondImageRef.current !== defaultImageRef.current) {
      setDisplayImage(secondImageRef.current);
    }
  };
  
  // Handle mouse leave for hover effect
  const handleMouseLeave = () => {
    setIsHovering(false);
    
    // Revert to default image if no color selected
    if (!selectedColor) {
      setDisplayImage(defaultImageRef.current);
    }
  };
  
  // Handle color dot click
  const handleColorClick = (color, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Clear hover state
    setIsHovering(false);
    
    // Set selected color and image
    setSelectedColor(color.value);
    setDisplayImage(color.imageUrl);
    
    // Don't reset isImageLoaded - prevents flicker
    // The image might already be cached
  };
  
  // Reset to default image - NO FLICKER VERSION
  const resetToDefault = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Clear hover state and selected color
    setIsHovering(false);
    setSelectedColor(null);
    
    // Set to default image without resetting loading state
    setDisplayImage(defaultImageRef.current);
    
    // If default image is already loaded, no need to show skeleton
    // The image will likely be cached
  };
  
  // Handle image load
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };
  
  // Handle image error
  const handleImageError = () => {
    console.error("Failed to load image:", displayImage);
    setIsImageLoaded(true); // Hide skeleton even on error
  };
  
  if (!product) return null;
  
  const hasHoverEffect = secondImageRef.current && 
                        secondImageRef.current !== defaultImageRef.current;
  
  return (
    <Link to={`/products/${product.handle}`} className="block">
      <div 
        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300 relative group animate-fade-in"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Product Image Container */}
        <div className="relative overflow-hidden rounded-md bg-gray-100 aspect-[2/3]">
          {/* Loading skeleton - Only show if image hasn't loaded AND we're showing default or second image */}
          {!isImageLoaded && (displayImage === defaultImageRef.current || displayImage === secondImageRef.current) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="w-full h-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer"></div>
            </div>
          )}
          
          {/* Main Image */}
          {displayImage && (
            <img
              src={displayImage}
              alt={product.featuredImage?.altText || product.title}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
              width="1539"
              height="2310"
              key={displayImage} // Key helps React differentiate images
            />
          )}
          
          {/* Hover Indicator Badge */}
          {hasHoverEffect && !selectedColor && (
            <div className={`absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 z-10 ${
              isHovering ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}>
              👀 View
            </div>
          )}
          
          {/* Debug indicator - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute top-0 left-0 bg-black/70 text-white text-xs p-1 rounded-br z-20">
              {selectedColor ? `Color: ${selectedColor}` : isHovering ? 'Hover' : 'Default'}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-4 text-left">
          <h3 className="font-primary font-medium text-baltic text-base line-clamp-2 min-h-[2.5rem]">
            {product.title}
          </h3>
          <p className="font-primary text-lg font-semibold text-baltic mt-2">
            ₹{product.priceRange?.minVariantPrice?.amount || "0.00"}
          </p>
        </div>
        
        {/* Color Variants Dots */}
        {colorVariants.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1.5 justify-start">
              {colorVariants.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={(e) => handleColorClick(color, e)}
                  className={`w-5 h-5 rounded-full border transition-all duration-200 flex items-center justify-center ${
                    selectedColor === color.value 
                      ? 'border-gray-800 scale-125 ring-2 ring-offset-1 ring-gray-300' 
                      : 'border-gray-300 hover:border-gray-500 hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.displayColor }}
                  title={color.name}
                  aria-label={`Select ${color.name} color`}
                >
                  {selectedColor === color.value && (
                    <span className="text-xs text-white font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
            
            {/* Reset Selection Button */}
            {selectedColor && (
              <button
                type="button"
                onClick={resetToDefault}
                className="mt-2 text-xs text-gray-500 hover:text-baltic hover:bg-dawn py-1 px-2 rounded transition-colors duration-200 font-primary"
                aria-label="Reset to default color"
              >
                Reset to default image
              </button>
            )}
          </div>
        )}
        
        {/* Hover overlay effect */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 rounded-lg transition-all duration-300 pointer-events-none" />
      </div>
    </Link>
  );
}