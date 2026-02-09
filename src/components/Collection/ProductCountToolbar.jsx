import React from 'react';
import SortDropdown from '../Sort/SortDropdown';

const ProductCountToolbar = ({ 
  productCount, 
  filteredCount,
  onOpenFilter,
  sortOption,
  onSortChange,
  hasActiveFilters = false
}) => {
  return (
    <div className="w-full">
      {/* Main Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b border-gray-200">
        
        {/* Left: Product Count */}
        <div className="text-sm text-gray-700">
          {filteredCount === productCount ? (
            <span>{productCount} products</span>
          ) : (
            <span>Showing {filteredCount} of {productCount} products</span>
          )}
        </div>

        {/* Right: Filter & Sort */}
        <div className="flex items-center gap-4">
          {/* Filter Button */}
          <button
            onClick={onOpenFilter}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
            {hasActiveFilters && (
              <span className="ml-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-black text-xs text-white">
                •
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 hidden sm:inline">Sort by:</span>
            <SortDropdown 
              sortOption={sortOption} 
              onSortChange={onSortChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCountToolbar;