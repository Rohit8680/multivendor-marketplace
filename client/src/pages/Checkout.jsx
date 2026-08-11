import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { getErrorMessage } from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import { MapPin, Truck, CreditCard, CheckCircle2, ShieldCheck, X, QrCode, Smartphone, Landmark, Lock } from 'lucide-react';

const Checkout = () => {
  const { cart, cartCount, cartTotal, clearCartState } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: user ? user.name : '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY'); // Default to Razorpay
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Razorpay Simulator Modal State
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [razorpayOrderData, setRazorpayOrderData] = useState(null);

  const handleChange = (e) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!cart.items || cart.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. CASH ON DELIVERY FLOW
      if (paymentMethod === 'COD') {
        const { data } = await API.post('/orders', { deliveryAddress });
        clearCartState();
        setLoading(false);
        navigate(`/orders/${data._id}?placed=true`);
        return;
      }

      // 2. RAZORPAY ONLINE PAYMENT FLOW
      // Create Razorpay Order on Backend
      const { data } = await API.post('/orders/razorpay/create-order');
      setRazorpayOrderData(data);
      setLoading(false);

      // Open Razorpay Fail-Safe Payment Modal
      setShowRazorpayModal(true);

    } catch (err) {
      setLoading(false);
      setError(getErrorMessage(err));
    }
  };

  // Complete Razorpay Payment Verification
  const handleConfirmRazorpayPayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const fakePaymentId = `pay_rzp_${Date.now()}`;
      const fakeSignature = `sig_${Date.now()}_sha256`;

      const { data } = await API.post('/orders/razorpay/verify-payment', {
        razorpayOrderId: razorpayOrderData ? razorpayOrderData.razorpayOrderId : `order_rzp_${Date.now()}`,
        razorpayPaymentId: fakePaymentId,
        razorpaySignature: fakeSignature,
        deliveryAddress
      });

      clearCartState();
      setShowRazorpayModal(false);
      setLoading(false);
      navigate(`/orders/${data._id}?placed=true`);
    } catch (err) {
      setLoading(false);
      setError(getErrorMessage(err));
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }} className="glass-panel p-6">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary mt-4">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.4rem' }}>
        Checkout & Payment
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Provide delivery address and choose your payment method (Razorpay UPI / Cards / COD).
      </p>

      <ErrorMessage message={error} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Delivery Address & Payment Method Form */}
        <form onSubmit={handlePlaceOrder} className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} color="#ec4899" /> 1. Shipping Address
          </h3>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              className="form-input"
              value={deliveryAddress.fullName}
              onChange={handleChange}
              placeholder="Recipient full name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              className="form-input"
              value={deliveryAddress.phone}
              onChange={handleChange}
              placeholder="Mobile contact number"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Street Address</label>
            <textarea
              name="address"
              rows={2}
              required
              className="form-textarea"
              value={deliveryAddress.address}
              onChange={handleChange}
              placeholder="House/Apartment no, Street, Area"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                required
                className="form-input"
                value={deliveryAddress.city}
                onChange={handleChange}
                placeholder="City"
              />
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                name="state"
                required
                className="form-input"
                value={deliveryAddress.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Pincode / Postal Code</label>
            <input
              type="text"
              name="pincode"
              required
              className="form-input"
              value={deliveryAddress.pincode}
              onChange={handleChange}
              placeholder="Pincode"
            />
          </div>

          {/* Payment Method Selector */}
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginTop: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={20} color="#6366f1" /> 2. Choose Payment Method
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.8rem' }}>
            {/* Razorpay Option */}
            <div
              onClick={() => setPaymentMethod('RAZORPAY')}
              style={{
                background: paymentMethod === 'RAZORPAY' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                border: `2px solid ${paymentMethod === 'RAZORPAY' ? '#6366f1' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === 'RAZORPAY'}
                onChange={() => setPaymentMethod('RAZORPAY')}
                style={{ width: '18px', height: '18px', accentColor: '#6366f1', cursor: 'pointer' }}
              />
              <CreditCard size={24} color="#6366f1" />
              <div>
                <strong style={{ color: '#ffffff', display: 'block', fontSize: '0.95rem' }}>
                  Razorpay Online Payment (UPI, Cards, NetBanking)
                </strong>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Google Pay, PhonePe, Paytm, Credit/Debit Cards & NetBanking
                </span>
              </div>
            </div>

            {/* Cash on Delivery Option */}
            <div
              onClick={() => setPaymentMethod('COD')}
              style={{
                background: paymentMethod === 'COD' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                border: `2px solid ${paymentMethod === 'COD' ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === 'COD'}
                onChange={() => setPaymentMethod('COD')}
                style={{ width: '18px', height: '18px', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
              <Truck size={24} color="#38bdf8" />
              <div>
                <strong style={{ color: '#ffffff', display: 'block', fontSize: '0.95rem' }}>
                  Cash on Delivery (COD)
                </strong>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Pay cash when your order is delivered to your address
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', gap: '0.6rem' }}
          >
            <CheckCircle2 size={20} />
            {loading ? 'Processing...' : paymentMethod === 'RAZORPAY' ? 'Proceed to Razorpay Payment' : 'Confirm Order (COD)'}
          </button>
        </form>

        {/* Order Items Review Box */}
        <div>
          <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              Order Review ({cartCount} items)
            </h3>

            <div style={{ maxHeight: '320px', overflowY: 'auto', marginBottom: '1.2rem' }}>
              {cart.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem', marginBottom: '0.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=80'; }}
                    />
                    <div>
                      <h5 style={{ fontSize: '0.85rem', color: '#f8fafc' }}>{item.product.name}</h5>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Qty: {item.quantity} × ₹{item.product.price ? item.product.price.toLocaleString('en-IN') : 0}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                    ₹{(item.quantity * item.product.price).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, paddingTop: '0.8rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ color: '#ffffff' }}>Total Payable</span>
              <span style={{ color: '#6366f1', fontFamily: 'var(--font-heading)' }}>₹{cartTotal ? cartTotal.toLocaleString('en-IN') : 0}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.2rem', fontSize: '0.78rem', color: '#94a3b8', justifyContent: 'center' }}>
              <ShieldCheck size={16} color="#10b981" />
              <span>Razorpay Secured 256-bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 RAZORPAY SECURE PAYMENT MODAL */}
      {showRazorpayModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(9, 13, 22, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="animate-fade-in" style={{
            background: '#0f172a',
            border: '2px solid #6366f1',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '480px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(99, 102, 241, 0.4)'
          }}>
            {/* Razorpay Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              padding: '1.25rem 1.5rem',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ background: '#ffffff', borderRadius: '8px', padding: '0.4rem 0.6rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#0f172a', fontWeight: 900, fontFamily: 'var(--font-heading)', fontSize: '1.1rem', letterSpacing: '-0.03em' }}>
                    RAZORPAY
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', opacity: 0.9, display: 'block' }}>NexusMarket Checkout</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => setShowRazorpayModal(false)}
                style={{ background: 'rgba(255, 255, 255, 0.2)', border: 'none', color: '#ffffff', padding: '0.4rem', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body Options */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lock size={14} color="#10b981" />
                <span>Test Mode Active — Select UPI / Card to Complete Payment</span>
              </div>

              {/* Payment Methods List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                {/* Google Pay / PhonePe UPI */}
                <div
                  onClick={() => setSelectedUpiApp('gpay')}
                  style={{
                    background: selectedUpiApp === 'gpay' ? 'rgba(99, 102, 241, 0.15)' : '#1e293b',
                    border: `1px solid ${selectedUpiApp === 'gpay' ? '#6366f1' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '10px',
                    padding: '0.9rem 1.2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <Smartphone size={20} color="#38bdf8" />
                    <div>
                      <strong style={{ color: '#ffffff', fontSize: '0.9rem', display: 'block' }}>UPI (Google Pay / PhonePe / Paytm)</strong>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Instant QR & Mobile UPI Payment</span>
                    </div>
                  </div>
                  <input type="radio" checked={selectedUpiApp === 'gpay'} readOnly style={{ accentColor: '#6366f1' }} />
                </div>

                {/* Cards */}
                <div
                  onClick={() => setSelectedUpiApp('card')}
                  style={{
                    background: selectedUpiApp === 'card' ? 'rgba(99, 102, 241, 0.15)' : '#1e293b',
                    border: `1px solid ${selectedUpiApp === 'card' ? '#6366f1' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '10px',
                    padding: '0.9rem 1.2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <CreditCard size={20} color="#ec4899" />
                    <div>
                      <strong style={{ color: '#ffffff', fontSize: '0.9rem', display: 'block' }}>Credit / Debit Card</strong>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Visa, MasterCard, RuPay, Maestro</span>
                    </div>
                  </div>
                  <input type="radio" checked={selectedUpiApp === 'card'} readOnly style={{ accentColor: '#6366f1' }} />
                </div>

                {/* NetBanking */}
                <div
                  onClick={() => setSelectedUpiApp('netbanking')}
                  style={{
                    background: selectedUpiApp === 'netbanking' ? 'rgba(99, 102, 241, 0.15)' : '#1e293b',
                    border: `1px solid ${selectedUpiApp === 'netbanking' ? '#6366f1' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '10px',
                    padding: '0.9rem 1.2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <Landmark size={20} color="#10b981" />
                    <div>
                      <strong style={{ color: '#ffffff', fontSize: '0.9rem', display: 'block' }}>NetBanking</strong>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>SBI, HDFC, ICICI, Axis & 50+ Banks</span>
                    </div>
                  </div>
                  <input type="radio" checked={selectedUpiApp === 'netbanking'} readOnly style={{ accentColor: '#6366f1' }} />
                </div>
              </div>

              {/* Confirm Action Button */}
              <button
                onClick={handleConfirmRazorpayPayment}
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                  gap: '0.6rem'
                }}
              >
                <CheckCircle2 size={20} />
                {loading ? 'Verifying Payment...' : `Pay ₹${cartTotal.toLocaleString('en-IN')} via Razorpay`}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                <ShieldCheck size={14} color="#10b981" />
                <span>Secured by Razorpay Payments System</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
