import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';

const CartPage = () => {
  const { cart, cartCount, cartTotal, loading, error } = useContext(CartContext);
  const navigate = useNavigate();

  if (loading) return <Loading message="Loading cart items..." />;

  const isEmpty = !cart.items || cart.items.length === 0;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.4rem' }}>
        Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Review items in your cart before proceeding to Cash on Delivery checkout.
      </p>

      <ErrorMessage message={error} />

      {isEmpty ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <ShoppingBag size={54} color="#6366f1" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.4rem' }}>Your Cart is Empty</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.8rem' }}>
            Looks like you haven't added any marketplace items to your cart yet.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg" style={{ gap: '0.6rem' }}>
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Cart Items Column */}
          <div style={{ flex: 1 }}>
            {cart.items.map((item) => (
              <CartItem key={item.product._id} item={item} />
            ))}

            <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#6366f1', fontSize: '0.9rem', fontWeight: 600, marginTop: '1rem' }}>
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>

          {/* Cart Summary Sidebar */}
          <div>
            <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.95rem', color: '#cbd5e1' }}>
                <span>Total Quantity</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>{cartCount} items</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.95rem', color: '#cbd5e1' }}>
                <span>Payment Method</span>
                <span className="badge badge-info">Cash on Delivery</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '1.2rem', fontWeight: 800 }}>
                <span style={{ color: '#ffffff' }}>Total Amount</span>
                <span style={{ color: '#6366f1', fontFamily: 'var(--font-heading)' }}>₹{cartTotal ? cartTotal.toLocaleString('en-IN') : 0}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', gap: '0.6rem' }}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.2rem', fontSize: '0.78rem', color: '#94a3b8', justifyContent: 'center' }}>
                <ShieldCheck size={16} color="#10b981" />
                <span>Zero online payment risk (Pay on Delivery)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
