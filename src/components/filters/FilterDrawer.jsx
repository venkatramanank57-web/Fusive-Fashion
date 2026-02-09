import React, { useState, useEffect, useMemo } from 'react';

const FilterDrawer = ({ 
  isOpen, 
  onClose, 
  filters, 
  setFilters,
  products = [],
  onRemoveAll 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Extract actual colors and sizes from products
  const { colorOptions, sizeOptions, inStockCount, outOfStockCount } = useMemo(() => {
    const colorsMap = new Map();
    const sizesMap = new Map();
    let inStock = 0;
    let outOfStock = 0;

    products.forEach(({ node }) => {
      // Check availability
      const isInStock = node.variants?.edges?.some(variant => variant.node.availableForSale);
      if (isInStock) {
        inStock++;
      } else {
        outOfStock++;
      }

      // Extract colors
      const colorOption = node.options?.find(opt => 
        opt.name.toLowerCase().includes("color") || 
        opt.name.toLowerCase().includes("colour")
      );
      
      if (colorOption?.values) {
        colorOption.values.forEach(color => {
          const colorName = color.toLowerCase();
          colorsMap.set(colorName, (colorsMap.get(colorName) || 0) + 1);
        });
      }

      // Extract sizes
      const sizeOption = node.options?.find(opt => 
        opt.name.toLowerCase().includes("size")
      );
      
      if (sizeOption?.values) {
        sizeOption.values.forEach(size => {
          const sizeName = size.toUpperCase();
          sizesMap.set(sizeName, (sizesMap.get(sizeName) || 0) + 1);
        });
      }

      // Also check variants
      node.variants?.edges?.forEach(variant => {
        if (variant.node.selectedOptions) {
          variant.node.selectedOptions.forEach(option => {
            if (option.name.toLowerCase().includes("color") || option.name.toLowerCase().includes("colour")) {
              const colorName = option.value.toLowerCase();
              colorsMap.set(colorName, (colorsMap.get(colorName) || 0) + 1);
            }
            if (option.name.toLowerCase().includes("size")) {
              const sizeName = option.value.toUpperCase();
              sizesMap.set(sizeName, (sizesMap.get(sizeName) || 0) + 1);
            }
          });
        }
      });
    });

    // Convert maps to arrays
    const colorOptions = Array.from(colorsMap.entries())
      .map(([value, count]) => ({
        name: value.charAt(0).toUpperCase() + value.slice(1),
        value,
        count,
        // Assign colors based on name
        color: getColorClass(value)
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const sizeOptions = Array.from(sizesMap.entries())
      .map(([value, count]) => ({
        name: value,
        value,
        count
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      colorOptions: colorOptions.length > 0 ? colorOptions : getDefaultColors(),
      sizeOptions: sizeOptions.length > 0 ? sizeOptions : getDefaultSizes(),
      inStockCount: inStock || 10,
      outOfStockCount: outOfStock || 0
    };
  }, [products]);

  // Helper function to get color class
  function getColorClass(colorName) {
    const colorMap = {
      black: 'bg-black',
      navy: 'bg-blue-900',
      gray: 'bg-gray-500',
      grey: 'bg-gray-500',
      brown: 'bg-amber-900',
      beige: 'bg-amber-200',
      white: 'bg-white border border-gray-300',
      red: 'bg-red-600',
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      yellow: 'bg-yellow-400',
      purple: 'bg-purple-600',
      pink: 'bg-pink-400',
      orange: 'bg-orange-500',
      teal: 'bg-teal-500',
      maroon: 'bg-red-800',
      olive: 'bg-yellow-800',
      cyan: 'bg-cyan-400',
      lime: 'bg-lime-400',
      indigo: 'bg-indigo-700',
      violet: 'bg-violet-700',
    };
    
    return colorMap[colorName] || 'bg-gray-400';
  }

  // Default colors if none found
  function getDefaultColors() {
    return [
      { name: 'Black', value: 'black', color: 'bg-black' },
      { name: 'Navy', value: 'navy', color: 'bg-blue-900' },
      { name: 'Gray', value: 'gray', color: 'bg-gray-500' },
      { name: 'Brown', value: 'brown', color: 'bg-amber-900' },
      { name: 'Beige', value: 'beige', color: 'bg-amber-200' },
      { name: 'White', value: 'white', color: 'bg-white border border-gray-300' },
      { name: 'Red', value: 'red', color: 'bg-red-600' },
      { name: 'Blue', value: 'blue', color: 'bg-blue-600' },
      { name: 'Green', value: 'green', color: 'bg-green-600' },
      { name: 'Yellow', value: 'yellow', color: 'bg-yellow-400' },
      { name: 'Purple', value: 'purple', color: 'bg-purple-600' },
      { name: 'Pink', value: 'pink', color: 'bg-pink-400' },
      { name: 'Orange', value: 'orange', color: 'bg-orange-500' },
      { name: 'Teal', value: 'teal', color: 'bg-teal-500' },
    ];
  }

  // Default sizes if none found
  function getDefaultSizes() {
    return [
      { name: 'S', value: 'S', count: 1 },
      { name: 'M', value: 'M', count: 1 },
      { name: 'L', value: 'L', count: 1 },
      { name: '36', value: '36', count: 9 },
      { name: '38', value: '38', count: 9 },
      { name: '40', value: '40', count: 9 },
      { name: '42', value: '42', count: 9 },
    ];
  }

  const handleApply = () => {
    console.log('Applying filters:', localFilters);
    setFilters(localFilters);
    onClose();
  };

  const handleRemoveAll = () => {
    console.log('Removing all filters');
    const clearedFilters = {
      availability: [],
      colors: [],
      sizes: []
    };
    setLocalFilters(clearedFilters);
    onRemoveAll();
  };

  const handleAvailabilityChange = (value) => {
    const newAvailability = localFilters.availability.includes(value)
      ? localFilters.availability.filter(v => v !== value)
      : [...localFilters.availability, value];
    
    setLocalFilters({
      ...localFilters,
      availability: newAvailability
    });
  };

  const handleColorChange = (value) => {
    const newColors = localFilters.colors.includes(value)
      ? localFilters.colors.filter(v => v !== value)
      : [...localFilters.colors, value];
    
    setLocalFilters({
      ...localFilters,
      colors: newColors
    });
  };

  const handleSizeChange = (value) => {
    const newSizes = localFilters.sizes.includes(value)
      ? localFilters.sizes.filter(v => v !== value)
      : [...localFilters.sizes, value];
    
    setLocalFilters({
      ...localFilters,
      sizes: newSizes
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-xl z-50 overflow-y-auto">
        
        {/* Header with Close Button */}
        <div className="border-b border-gray-200 px-6 py-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">FILTER</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6 space-y-8">
          
          {/* AVAILABILITY */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">AVAILABILITY</h3>
            
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.availability.includes('in-stock')}
                  onChange={() => handleAvailabilityChange('in-stock')}
                  className="h-5 w-5 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="ml-3 text-gray-700">
                  In stock ({inStockCount})
                </span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.availability.includes('out-of-stock')}
                  onChange={() => handleAvailabilityChange('out-of-stock')}
                  className="h-5 w-5 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="ml-3 text-gray-700">
                  Out of stock ({outOfStockCount})
                </span>
              </label>
            </div>
          </div>

          {/* COLOR */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">COLOR</h3>
            <div className="grid grid-cols-5 gap-3">
              {colorOptions.map(color => (
                <div key={color.value} className="relative">
                  <input
                    type="checkbox"
                    id={`color-${color.value}`}
                    checked={localFilters.colors.includes(color.value)}
                    onChange={() => handleColorChange(color.value)}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor={`color-${color.value}`}
                    className={`flex flex-col items-center cursor-pointer`}
                  >
                    <div className={`h-10 w-10 rounded-full ${color.color} mb-1 flex items-center justify-center peer-checked:ring-2 peer-checked:ring-black peer-checked:ring-offset-2`}>
                      {localFilters.colors.includes(color.value) && (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-gray-600 capitalize">{color.name}</span>
                    {color.count && <span className="text-xs text-gray-400">({color.count})</span>}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* SIZE */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">SIZE</h3>
            <div className="space-y-2">
              {sizeOptions.map(size => (
                <label key={size.value} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.sizes.includes(size.value)}
                      onChange={() => handleSizeChange(size.value)}
                      className="h-5 w-5 text-black border-gray-300 rounded focus:ring-black"
                    />
                    <span className="ml-3 text-gray-700">
                      {size.name} ({size.count})
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 space-y-3">
          <button
            onClick={handleApply}
            className="w-full bg-black text-white py-3.5 px-4 text-sm font-medium rounded-md hover:bg-gray-900 transition-colors"
          >
            Apply
          </button>
          <button
            onClick={handleRemoveAll}
            className="w-full bg-white text-gray-700 py-3.5 px-4 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Remove all
          </button>
        </div>

      </div>
    </>
  );
};

export default FilterDrawer;