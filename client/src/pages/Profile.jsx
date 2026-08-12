import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, Store, Calendar, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            margin: '0 auto 1rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '1.8rem',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#ffffff' }}>{user.name}</h2>
          <span className="badge badge-info" style={{ marginTop: '0.4rem' }}>
            {user.role} ACCOUNT
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: '#1e293b', padding: '1rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Mail size={18} color="#6366f1" />
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Email Address</span>
              <span style={{ fontSize: '0.95rem', color: '#f8fafc', fontWeight: 500 }}>{user.email}</span>
            </div>
          </div>

          {user.role === 'SELLER' && (
            <div style={{ background: '#1e293b', padding: '1rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Store size={18} color="#f59e0b" />
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Seller Approval Status</span>
                {user.sellerStatus === 'APPROVED' ? (
                  <span className="badge badge-approved">APPROVED</span>
                ) : user.sellerStatus === 'REJECTED' ? (
                  <span className="badge badge-rejected">REJECTED</span>
                ) : (
                  <span className="badge badge-pending">PENDING ADMIN APPROVAL</span>
                )}
              </div>
            </div>
          )}

          <div style={{ background: '#1e293b', padding: '1rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Calendar size={18} color="#38bdf8" />
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Member Since</span>
              <span style={{ fontSize: '0.95rem', color: '#f8fafc' }}>
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '2026'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {user.role === 'CUSTOMER' && (
            <Link to="/orders" className="btn btn-primary" style={{ flex: 1 }}>
              View My Orders
            </Link>
          )}
          {user.role === 'SELLER' && (
            <Link to="/seller/dashboard" className="btn btn-primary" style={{ flex: 1 }}>
              Seller Dashboard
            </Link>
          )}
          {user.role === 'ADMIN' && (
            <Link to="/admin/dashboard" className="btn btn-primary" style={{ flex: 1 }}>
              Admin Console
            </Link>
          )}
          <button onClick={logout} className="btn btn-danger" style={{ gap: '0.4rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
