import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API, { getErrorMessage } from '../../services/api';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { Users, Store, Package, ShoppingBag, Clock, Shield, Layers } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    pendingSellers: 0,
    totalProducts: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/admin/dashboard');
        setStats(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(getErrorMessage(err));
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loading message="Loading Admin Dashboard statistics..." />;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Shield color="#38bdf8" size={32} /> Platform Admin Dashboard
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Marketplace platform overview, seller approvals, category management, and audit controls
        </p>
      </div>

      <ErrorMessage message={error} />

      {/* Admin Stat Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.9rem', borderRadius: '10px', color: '#6366f1' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Total Customers</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
              {stats.totalUsers}
            </span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '0.9rem', borderRadius: '10px', color: '#38bdf8' }}>
            <Store size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Total Sellers</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
              {stats.totalSellers}
            </span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.9rem', borderRadius: '10px', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Pending Sellers</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-heading)' }}>
              {stats.pendingSellers}
            </span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(236, 72, 153, 0.15)', padding: '0.9rem', borderRadius: '10px', color: '#ec4899' }}>
            <Package size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Total Products</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
              {stats.totalProducts}
            </span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.9rem', borderRadius: '10px', color: '#10b981' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Total Orders</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
              {stats.totalOrders}
            </span>
          </div>
        </div>
      </div>

      {/* Admin Modules Navigation */}
      <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '1.2rem' }}>Administration Modules</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        <Link to="/admin/sellers" className="glass-panel" style={{ padding: '1.5rem', display: 'block', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem' }}>
            <Store size={22} color="#f59e0b" />
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>Seller Approvals</h3>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
            Approve or reject vendor account applications ({stats.pendingSellers} pending).
          </p>
        </Link>

        <Link to="/admin/categories" className="glass-panel" style={{ padding: '1.5rem', display: 'block', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem' }}>
            <Layers size={22} color="#38bdf8" />
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>Categories Management</h3>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
            Create, edit, and delete product categories available to sellers.
          </p>
        </Link>

        <Link to="/admin/users" className="glass-panel" style={{ padding: '1.5rem', display: 'block', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem' }}>
            <Users size={22} color="#6366f1" />
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>Users Directory</h3>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
            View all registered customers, sellers, and administrators.
          </p>
        </Link>

        <Link to="/admin/products" className="glass-panel" style={{ padding: '1.5rem', display: 'block', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem' }}>
            <Package size={22} color="#ec4899" />
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>Product Audit</h3>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
            Audit all platform products and remove non-compliant items.
          </p>
        </Link>

        <Link to="/admin/orders" className="glass-panel" style={{ padding: '1.5rem', display: 'block', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem' }}>
            <ShoppingBag size={22} color="#10b981" />
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>Platform Orders</h3>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
            Monitor platform-wide order flow and fulfillment statuses.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
