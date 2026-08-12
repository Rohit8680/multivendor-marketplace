import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { ShoppingBag, ArrowRight, Store, ShieldCheck, Sparkles, Layers } from 'lucide-react';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          API.get('/categories'),
          API.get('/products?limit=8')
        ]);
        setCategories(catRes.data || []);
        setFeaturedProducts(prodRes.data.products || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Failed to load marketplace content');
      }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section" style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '4rem 2rem',
        marginBottom: '3.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-glow)'
      }}>
        <div style={{ maxWidth: '650px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '9999px', padding: '0.35rem 0.9rem', fontSize: '0.8rem', color: '#818cf8', fontWeight: 600, marginBottom: '1.2rem' }}>
            <Sparkles size={14} /> Next-Gen Multi-Vendor Marketplace
          </div>
          <h1 className="hero-title" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', lineHeight: '1.15', color: '#ffffff' }}>
            Discover Products from Verified <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Independent Sellers</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            Shop tech, fashion, home decor, and sports gear directly from trusted vendors with Cash on Delivery & transparent order tracking.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-primary btn-lg" style={{ gap: '0.6rem' }}>
              Explore Products <ArrowRight size={18} />
            </Link>
            <Link to="/register?role=SELLER" className="btn btn-secondary btn-lg" style={{ gap: '0.6rem' }}>
              <Store size={18} /> Become a Seller
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.2rem' }}>Shop by Category</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Browse top categories across our vendor network</p>
          </div>
          <Link to="/products" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="category-grid">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => navigate(`/products?category=${cat.slug}`)}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                margin: '0 auto 1rem auto',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6366f1'
              }}>
                <Layers size={28} />
              </div>
              <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '0.4rem' }}>{cat.name}</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{cat.description || 'Explore products'}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.2rem' }}>Featured Marketplace Products</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Handpicked products from top-rated sellers</p>
          </div>
          <Link to="/products" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Browse Catalog <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <Loading message="Loading featured marketplace products..." />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <div className="grid-cards">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
