// =====================================
// src/components/ProductCard.jsx
// PURPOSE:
// This component DISPLAYS A SINGLE PRODUCT CARD with enhanced features:
// - Default product image
// - Hover image change
// - Color variant dots display
// - Color click image change
//
// Used in:
// - Home page
// - Product listing sections
// =====================================

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ProductCard({ product }) {
  // State for managing images and selected color
  const [currentImage, setCurrentImage] = useState("");
  const [hoverImage, setHoverImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  
  // Extract unique colors from variants
  const [colorVariants, setColorVariants] = useState([]);
  
  // Initialize component with product data
  useEffect(() => {
    if (product) {
      // Set default featured image
      setCurrentImage(product.featuredImage?.url || "");
      
      // Find hover image (second image if available)
      const allImages = product.images?.edges || [];
      const hoverImg = allImages.length > 1 ? allImages[1].node.url : allImages[0]?.node.url;
      setHoverImage(hoverImg || product.featuredImage?.url);
      
      // Extract unique colors from variants
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
    }
  }, [product]);
  
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
      'gold': '#FFD700'
    };
    
    return colorMap[colorName.toLowerCase()] || '#CCCCCC';
  };
  
  // Handle mouse enter for hover effect
  const handleMouseEnter = () => {
    if (hoverImage && hoverImage !== currentImage && !selectedColor) {
      setCurrentImage(hoverImage);
    }
  };
  
  // Handle mouse leave for hover effect
  const handleMouseLeave = () => {
    if (selectedColor) return; // Don't change if color is selected
    
    if (hoverImage && hoverImage !== currentImage) {
      const defaultImage = product.featuredImage?.url || "";
      setCurrentImage(defaultImage);
    }
  };
  
  // Handle color dot click
  const handleColorClick = (color, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setSelectedColor(color.value);
    setCurrentImage(color.imageUrl);
  };
  
  // If no product, return null
  if (!product) return null;
  
  return (
    <Link to={`/products/${product.handle}`}>
      <div 
        className="bg-white border rounded-lg p-4 hover:shadow transition relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Product Image */}
        <div className="relative overflow-hidden rounded">
          <img
            src={currentImage || product.featuredImage?.url}
            alt={product.featuredImage?.altText || product.title}
            className="w-full h-48 object-cover transition-all duration-300"
          />
          
          {/* Hover Indicator */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 pointer-events-none" />
        </div>

        {/* Product Info */}
        <h3 className="mt-3 font-medium line-clamp-2">{product.title}</h3>
        <p className="text-sm mt-1">
          ₹{product.priceRange?.minVariantPrice?.amount || "0.00"}
        </p>
        
        {/* Color Variants Dots */}
        {colorVariants.length > 0 && (
          <div className="flex gap-2 mt-3">
            {colorVariants.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={(e) => handleColorClick(color, e)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  selectedColor === color.value 
                    ? 'border-gray-800 scale-110' 
                    : 'border-gray-300 hover:border-gray-500'
                }`}
                style={{ backgroundColor: color.displayColor }}
                title={color.name}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>
        )}
        
        {/* Reset Selection Button (only when a color is selected) */}
        {selectedColor && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedColor(null);
              setCurrentImage(product.featuredImage?.url || "");
            }}
            className="mt-2 text-xs text-gray-600 hover:text-gray-800 underline"
            aria-label="Reset to default color"
          >
            Reset
          </button>
        )}
      </div>
    </Link>
  );
}