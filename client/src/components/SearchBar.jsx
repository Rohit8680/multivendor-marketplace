import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, onClear, placeholder = 'Search by product name...' }) => {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-input"
        style={{
          paddingLeft: '2.6rem',
          paddingRight: value ? '2.5rem' : '1rem',
          background: 'rgba(30, 41, 59, 0.8)',
          borderRadius: 'var(--radius-sm)'
        }}
      />
      <Search
        size={18}
        color="#94a3b8"
        style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }}
      />
      {value && (
        <button
          onClick={onClear}
          type="button"
          style={{
            position: 'absolute',
            right: '0.8rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
