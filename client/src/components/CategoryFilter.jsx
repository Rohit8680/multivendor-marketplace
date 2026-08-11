import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}>
      <button
        onClick={() => onSelectCategory('')}
        className={`btn btn-sm ${selectedCategory === '' ? 'btn-primary' : 'btn-secondary'}`}
        style={{ borderRadius: '9999px', fontSize: '0.85rem' }}
      >
        All Categories
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.slug || selectedCategory === cat._id;
        return (
          <button
            key={cat._id}
            onClick={() => onSelectCategory(cat.slug)}
            className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '9999px', fontSize: '0.85rem' }}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
