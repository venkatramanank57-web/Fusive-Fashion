import React, { useState, useEffect, useRef } from 'react';

const sortOptions = [
  { value: 'best-selling', label: 'Best selling' },
  { value: 'featured', label: 'Featured' },
  { value: 'a-z', label: 'Alphabetically, A-Z' },
  { value: 'z-a', label: 'Alphabetically, Z-A' },
  { value: 'price-low-high', label: 'Price, low to high' },
  { value: 'price-high-low', label: 'Price, high to low' },
  { value: 'date-old-new', label: 'Date, old to new' },
  { value: 'date-new-old', label: 'Date, new to old' },
];

const SortDropdown = ({ sortOption = 'best-selling', onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (value) => {
    console.log('Sort changed to:', value); // Debug log
    if (onSortChange && typeof onSortChange === 'function') {
      onSortChange(value);
    } else {
      console.error('onSortChange is not a function:', onSortChange);
    }
    setIsOpen(false);
  };

  const selectedOption = sortOptions.find(opt => opt.value === sortOption) || sortOptions[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 hidden sm:inline">Sort by:</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 font-medium hover:bg-gray-50 rounded-md"
        >
          <span>{selectedOption.label}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                className={`block w-full text-left px-4 py-3 text-sm transition-colors ${
                  sortOption === option.value
                    ? 'text-black font-medium bg-gray-50'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;