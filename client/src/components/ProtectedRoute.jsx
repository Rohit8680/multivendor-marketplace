import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles = [], requireApprovedSeller = false }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Check Seller approval status
  if (requireApprovedSeller && user.role === 'SELLER' && user.sellerStatus !== 'APPROVED') {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }} className="glass-panel p-6 animate-fade-in">
        {user.sellerStatus === 'PENDING' ? (
          <>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '1.2rem', borderRadius: '9999px', display: 'inline-flex', marginBottom: '1rem' }}>
              <Clock size={48} color="#f59e0b" />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.8rem', color: '#f8fafc' }}>Seller Account Under Admin Review</h2>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Thank you for registering as a seller on NexusMarket. Your account status is currently <strong>PENDING</strong> approval by the platform Administrator. You will be able to add products and fulfill orders once approved.
            </p>
          </>
        ) : (
          <>
            <div style={{ background: 'rgba(244, 63, 94, 0.15)', padding: '1.2rem', borderRadius: '9999px', display: 'inline-flex', marginBottom: '1rem' }}>
              <AlertTriangle size={48} color="#f43f5e" />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.8rem', color: '#f8fafc' }}>Seller Application Status: REJECTED</h2>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              We regret to inform you that your seller account request has been reviewed and rejected by the Administrator. Please contact platform support for further details.
            </p>
          </>
        )}
        <Link to="/" className="btn btn-secondary" style={{ gap: '0.5rem' }}>
          <ArrowLeft size={16} /> Return to Home Catalog
        </Link>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
