import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import { UserPlus, User, Mail, Lock, Store } from 'lucide-react';

const Register = () => {
  const location = useLocation();
  const initialRole = new URLSearchParams(location.search).get('role') === 'SELLER' ? 'SELLER' : 'CUSTOMER';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole);
  const { register, loading, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setError(null);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(name, email, password, role);
      if (user.role === 'SELLER') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      // Error handled in AuthContext
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '3rem auto' }} className="glass-panel animate-fade-in">
      <div style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', width: '54px', height: '54px', borderRadius: '50%', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
            <UserPlus size={26} />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#ffffff' }}>Create an Account</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.3rem' }}>
            Join NexusMarket as a Customer or Seller
          </p>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          {/* Account Type Selector */}
          <div className="form-group">
            <label className="form-label">I want to register as:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <button
                type="button"
                onClick={() => setRole('CUSTOMER')}
                className={`btn ${role === 'CUSTOMER' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.75rem', gap: '0.4rem' }}
              >
                <User size={16} /> Customer
              </button>
              <button
                type="button"
                onClick={() => setRole('SELLER')}
                className={`btn ${role === 'SELLER' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.75rem', gap: '0.4rem' }}
              >
                <Store size={16} /> Seller
              </button>
            </div>
            {role === 'SELLER' && (
              <p style={{ fontSize: '0.78rem', color: '#f59e0b', marginTop: '0.4rem' }}>
                * Seller accounts require Admin approval before adding products.
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

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
                minLength={6}
                className="form-input"
                placeholder="At least 6 characters"
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
            {loading ? 'Creating Account...' : `Register as ${role}`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: '#6366f1' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
