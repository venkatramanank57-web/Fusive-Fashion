import React from 'react';

const AvailabilityFilter = ({ value, onChange }) => {
  return (
    <div className="availability-filter">
      <h3 className="filter-title">AVAILABILITY</h3>
      <h4 className="filter-subtitle">BLAZERS</h4>
      
      <div className="availability-options">
        <label className="availability-option">
          <input
            type="radio"
            name="availability"
            value="in-stock"
            checked={value === 'in-stock'}
            onChange={() => onChange('in-stock')}
          />
          <span className="option-label">
            In stock (10)
          </span>
        </label>
        
        <label className="availability-option">
          <input
            type="radio"
            name="availability"
            value="out-of-stock"
            checked={value === 'out-of-stock'}
            onChange={() => onChange('out-of-stock')}
          />
          <span className="option-label">
            Out of stock (0)
          </span>
        </label>
        
        <label className="availability-option">
          <input
            type="radio"
            name="availability"
            value="all"
            checked={value === 'all'}
            onChange={() => onChange('all')}
          />
          <span className="option-label">
            All
          </span>
        </label>
      </div>
    </div>
  );
};

export default AvailabilityFilter;