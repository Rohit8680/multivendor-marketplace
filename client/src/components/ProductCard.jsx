import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Store, CheckCircle, AlertCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart, loading: cartLoading } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const isOutOfStock = product.stock <= 0;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to add items to your cart.');
      return;
    }
    if (user.role !== 'CUSTOMER') {
      alert('Only customer accounts can add items to cart.');
      return;
    }
    try {
      await addToCart(product._id, 1);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Stock Badge */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
        {isOutOfStock ? (
          <span className="badge badge-outofstock">OUT OF STOCK</span>
        ) : (
          <span className="badge badge-approved">{product.stock} In Stock</span>
        )}
      </div>

      {/* Product Image */}
      <Link to={`/products/${product._id}`} style={{ overflow: 'hidden', display: 'block', height: '200px', background: '#1e293b' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=80';
          }}
        />
      </Link>

      {/* Card Content */}
      <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Category Name */}
        {product.category && (
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            {product.category.name || 'Category'}
          </span>
        )}

        {/* Product Title */}
        <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: '#f8fafc', marginBottom: '0.4rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h3>
        </Link>

        {/* Seller Info */}
        {product.seller && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.6rem' }}>
            <Store size={13} color="#94a3b8" />
            <span>Seller: <strong style={{ color: '#cbd5e1' }}>{product.seller.name}</strong></span>
          </div>
        )}

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#f59e0b' }}>
            <Star size={14} fill="#f59e0b" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, marginLeft: '0.2rem', color: '#f8fafc' }}>
              {product.rating ? product.rating.toFixed(1) : '0.0'}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({product.reviewCount || 0} reviews)</span>
        </div>

        {/* Price & Action */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.8rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Price</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
              ₹{product.price ? product.price.toLocaleString('en-IN') : 0}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`btn ${isOutOfStock ? 'btn-secondary' : 'btn-primary'} btn-sm`}
            style={{
              opacity: isOutOfStock ? 0.6 : 1,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer'
            }}
          >
            <ShoppingCart size={15} />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
