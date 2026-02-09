import React from 'react';

const sizes = [
  { id: 'xs', name: 'XS', count: 2 },
  { id: 's', name: 'S', count: 5 },
  { id: 'm', name: 'M', count: 8 },
  { id: 'l', name: 'L', count: 6 },
  { id: 'xl', name: 'XL', count: 3 },
  { id: 'xxl', name: 'XXL', count: 1 },
];

const SizeFilter = ({ selectedSizes, onChange }) => {
  const handleSizeToggle = (sizeId) => {
    const newSizes = selectedSizes.includes(sizeId)
      ? selectedSizes.filter(id => id !== sizeId)
      : [...selectedSizes, sizeId];
    onChange(newSizes);
  };

  return (
    <div className="size-filter">
      <h3 className="filter-title">SIZE</h3>
      <div className="size-options">
        {sizes.map(size => (
          <div key={size.id} className="size-option">
            <input
              type="checkbox"
              id={`size-${size.id}`}
              checked={selectedSizes.includes(size.id)}
              onChange={() => handleSizeToggle(size.id)}
            />
            <label htmlFor={`size-${size.id}`}>
              <span className="size-name">{size.name}</span>
              <span className="size-count">({size.count})</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SizeFilter;