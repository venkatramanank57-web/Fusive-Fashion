import React from 'react';

const colors = [
  { id: 'black', name: 'Black', count: 5 },
  { id: 'navy', name: 'Navy', count: 3 },
  { id: 'gray', name: 'Gray', count: 2 },
  { id: 'brown', name: 'Brown', count: 4 },
  { id: 'beige', name: 'Beige', count: 1 },
];

const ColorFilter = ({ selectedColors, onChange }) => {
  const handleColorToggle = (colorId) => {
    const newColors = selectedColors.includes(colorId)
      ? selectedColors.filter(id => id !== colorId)
      : [...selectedColors, colorId];
    onChange(newColors);
  };

  return (
    <div className="color-filter">
      <h3 className="filter-title">COLOR</h3>
      <div className="color-options">
        {colors.map(color => (
          <div key={color.id} className="color-option">
            <input
              type="checkbox"
              id={`color-${color.id}`}
              checked={selectedColors.includes(color.id)}
              onChange={() => handleColorToggle(color.id)}
            />
            <label htmlFor={`color-${color.id}`}>
              <span className="color-name">{color.name}</span>
              <span className="color-count">({color.count})</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorFilter;