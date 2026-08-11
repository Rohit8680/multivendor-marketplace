import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Shield, Truck, RefreshCw, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: '#090d16',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      marginTop: '4rem',
      padding: '3rem 1.5rem 1.5rem 1.5rem',
      color: '#94a3b8'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Features Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '2.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.8rem', borderRadius: '12px' }}>
              <Truck size={24} color="#6366f1" />
            </div>
            <div>
              <h4 style={{ color: '#f8fafc', fontSize: '0.95rem' }}>Fast Delivery</h4>
              <p style={{ fontSize: '0.8rem' }}>Reliable COD nationwide shipping</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.8rem', borderRadius: '12px' }}>
              <Shield size={24} color="#10b981" />
            </div>
            <div>
              <h4 style={{ color: '#f8fafc', fontSize: '0.95rem' }}>Verified Sellers</h4>
              <p style={{ fontSize: '0.8rem' }}>Strict admin seller approval</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '0.8rem', borderRadius: '12px' }}>
              <Award size={24} color="#ec4899" />
            </div>
            <div>
              <h4 style={{ color: '#f8fafc', fontSize: '0.95rem' }}>Quality Assurance</h4>
              <p style={{ fontSize: '0.8rem' }}>Authentic product ratings</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <ShoppingBag size={22} color="#6366f1" />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                Nexus<span style={{ color: '#6366f1' }}>Market</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
              Next-generation Multi-Vendor E-Commerce Platform. Connect with trusted sellers and shop premium products.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#f8fafc', marginBottom: '1rem', fontSize: '0.95rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
              <li><Link to="/orders">Order History</Link></li>
              <li><Link to="/profile">Account Settings</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#f8fafc', marginBottom: '1rem', fontSize: '0.95rem' }}>Seller Portal</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <li><Link to="/register?role=SELLER">Become a Seller</Link></li>
              <li><Link to="/seller/dashboard">Seller Hub</Link></li>
              <li><Link to="/seller/products">Manage Inventory</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#f8fafc', marginBottom: '1rem', fontSize: '0.95rem' }}>Platform Demo</h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Full Stack MERN Architecture Project.</p>
            <span className="badge badge-info">COD Payment Mode</span>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          fontSize: '0.8rem'
        }}>
          © {new Date().getFullYear()} NexusMarket. Built with React, Express, Node.js & MongoDB.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
