import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API, { getErrorMessage } from '../../services/api';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { Package, Layers, ShoppingBag, CheckCircle, Plus, Store, Clock } from 'lucide-react';

const SellerDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalStock: 0,
    activeOrders: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/seller/dashboard');
        setMetrics(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(getErrorMessage(err));
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <Loading message="Loading seller dashboard analytics..." />;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '0.3rem' }}>
            Seller Hub Dashboard
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Manage your store inventory, stock counts, and customer orders
          </p>
        </div>

        <Link to="/seller/products/add" className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      <ErrorMessage message={error} />

      {/* Seller Dashboard Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {/* Total Products */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '1rem', borderRadius: '12px', color: '#6366f1' }}>
            <Package size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block' }}>Total Products</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
              {metrics.totalProducts}
            </span>
          </div>
        </div>

        {/* Total Stock */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '1rem', borderRadius: '12px', color: '#38bdf8' }}>
            <Layers size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block' }}>Total Stock Inventory</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
              {metrics.totalStock}
            </span>
          </div>
        </div>

        {/* Active Orders */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '1rem', borderRadius: '12px', color: '#f59e0b' }}>
            <ShoppingBag size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block' }}>Active Orders</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
              {metrics.activeOrders}
            </span>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '1rem', borderRadius: '12px', color: '#10b981' }}>
            <CheckCircle size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block' }}>Completed Orders</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
              {metrics.completedOrders}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Panel */}
      <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '1.2rem' }}>Store Controls</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <Link to="/seller/products" className="glass-panel" style={{ padding: '1.8rem', display: 'block', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
            <Store size={24} color="#6366f1" />
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Manage Products & Stock</h3>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            View your active listings, update stock counts when new inventory arrives, edit prices, or delete products.
          </p>
        </Link>

        <Link to="/seller/orders" className="glass-panel" style={{ padding: '1.8rem', display: 'block', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
            <ShoppingBag size={24} color="#ec4899" />
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Customer Orders</h3>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            View customer orders containing your products and advance order statuses (PLACED → CONFIRMED → SHIPPED → DELIVERED).
          </p>
        </Link>
      </div>
    </div>
  );
};

export default SellerDashboard;
