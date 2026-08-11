import React, { useContext } from 'react';
import { Plus, Minus, Trash2, Store } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useContext(CartContext);
  const { product, quantity } = item;

  if (!product) return null;

  const handleIncrease = () => {
    if (quantity >= product.stock) {
      alert(`Cannot exceed available stock of ${product.stock}`);
      return;
    }
    updateQuantity(product._id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity <= 1) return;
    updateQuantity(product._id, quantity - 1);
  };

  const handleRemove = () => {
    removeFromCart(product._id);
  };

  const subtotal = product.price * quantity;

  return (
    <div className="glass-panel" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1.2rem',
      padding: '1rem 1.2rem',
      marginBottom: '1rem'
    }}>
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: '80px',
          height: '80px',
          objectFit: 'cover',
          borderRadius: 'var(--radius-sm)',
          background: '#1e293b'
        }}
        onError={(e) => {
          e.currentTarget.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=80';
        }}
      />

      {/* Item Details */}
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.2rem' }}>
          {product.name}
        </h4>

        {product.seller && (
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem' }}>
            <Store size={13} />
            <span>Seller: {product.seller.name}</span>
          </div>
        )}

        <div style={{ fontSize: '0.9rem', color: '#6366f1', fontWeight: 600 }}>
          ₹{product.price ? product.price.toLocaleString('en-IN') : 0} each
        </div>
      </div>

      {/* Quantity Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#1e293b',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.25rem 0.5rem'
        }}>
          <button
            onClick={handleDecrease}
            disabled={quantity <= 1}
            style={{
              background: 'transparent',
              color: quantity <= 1 ? '#64748b' : '#f8fafc',
              cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Minus size={14} />
          </button>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
            {quantity}
          </span>
          <button
            onClick={handleIncrease}
            disabled={quantity >= product.stock}
            style={{
              background: 'transparent',
              color: quantity >= product.stock ? '#64748b' : '#f8fafc',
              cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Plus size={14} />
          </button>
        </div>
        <span style={{ fontSize: '0.7rem', color: quantity >= product.stock ? '#f43f5e' : '#64748b' }}>
          {quantity >= product.stock ? `Max stock (${product.stock})` : `In Stock: ${product.stock}`}
        </span>
      </div>

      {/* Item Subtotal */}
      <div style={{ minWidth: '90px', textAlign: 'right' }}>
        <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8' }}>Subtotal</span>
        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
          ₹{subtotal ? subtotal.toLocaleString('en-IN') : 0}
        </span>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        title="Remove Item"
        style={{
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.2)',
          color: '#f43f5e',
          padding: '0.5rem',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default CartItem;
