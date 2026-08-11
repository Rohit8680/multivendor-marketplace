import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import { LogIn, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === 'SELLER') {
        navigate('/seller/dashboard');
      } else if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirect);
      }
    } catch (err) {
      // Error handled in AuthContext
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '3rem auto' }} className="glass-panel animate-fade-in">
      <div style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', width: '54px', height: '54px', borderRadius: '50%', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
            <LogIn size={26} />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#ffffff' }}>Account Login</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.3rem' }}>
            Access Customer, Seller, or Admin Dashboard
          </p>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Quick-Fill Helper Box */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.8rem',
          color: '#94a3b8'
        }}>
          <strong style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.4rem' }}>Demo Accounts:</strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            <button type="button" onClick={() => { setEmail('customer@marketplace.com'); setPassword('customer123'); }} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>Customer</button>
            <button type="button" onClick={() => { setEmail('seller@marketplace.com'); setPassword('seller123'); }} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>Approved Seller</button>
            <button type="button" onClick={() => { setEmail('pending@marketplace.com'); setPassword('pending123'); }} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>Pending Seller</button>
            <button type="button" onClick={() => { setEmail('admin@marketplace.com'); setPassword('admin123'); }} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>Admin</button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600, color: '#6366f1' }}>
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
