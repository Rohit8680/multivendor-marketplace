import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import API, { getErrorMessage } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { Package, MapPin, Truck, CheckCircle2, Clock, ArrowLeft, Store, ShieldCheck } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const justPlaced = searchParams.get('placed') === 'true';

  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status update state for Sellers/Admin
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get(`/orders/${id}`);
      setOrder(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      setStatusMsg(null);
      await API.put(`/seller/orders/${id}/status`, { orderStatus: newStatus });
      setStatusMsg(`Order status successfully updated to ${newStatus}`);
      setUpdatingStatus(false);
      fetchOrder(); // Refresh order details
    } catch (err) {
      setUpdatingStatus(false);
      alert(getErrorMessage(err));
    }
  };

  if (loading) return <Loading message="Fetching order details..." />;
  if (error || !order) return <ErrorMessage message={error || 'Order not found'} />;

  const isSeller = user && (user.role === 'SELLER' || user.role === 'ADMIN');

  const statusSteps = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
  const currentStepIdx = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <Link to={user && user.role === 'SELLER' ? '/seller/orders' : '/orders'} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', marginBottom: '1.5rem', fontWeight: 500, fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to {user && user.role === 'SELLER' ? 'Seller Orders' : 'My Orders'}
      </Link>

      {justPlaced && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '1rem 1.2rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <CheckCircle2 size={24} />
          <div>
            <h4 style={{ fontSize: '1rem', color: '#ffffff' }}>Order Confirmed Successfully!</h4>
            <p style={{ fontSize: '0.85rem' }}>Your order has been placed with the seller(s). Stock has been updated accordingly.</p>
          </div>
        </div>
      )}

      {statusMsg && (
        <div style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          {statusMsg}
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1.2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Order ID:</span>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>#{order._id}</h2>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Placed on {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Payment Method</span>
            {order.paymentMethod === 'RAZORPAY' ? (
              <span className="badge badge-approved" style={{ marginTop: '0.2rem' }}>RAZORPAY ONLINE</span>
            ) : (
              <span className="badge badge-info" style={{ marginTop: '0.2rem' }}>Cash on Delivery (COD)</span>
            )}
            <span style={{ display: 'block', fontSize: '0.78rem', color: order.paymentStatus === 'PAID' ? '#10b981' : '#f59e0b', marginTop: '0.3rem' }}>
              Status: {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Order Status Tracker Stepper */}
        <div style={{ padding: '2rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h4 style={{ fontSize: '0.95rem', color: '#cbd5e1', marginBottom: '1.2rem' }}>Order Status Progression:</h4>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            {statusSteps.map((step, idx) => {
              const isPassed = idx <= currentStepIdx;
              return (
                <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1, textAlign: 'center' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: isPassed ? '#6366f1' : '#1e293b',
                    border: `2px solid ${isPassed ? '#6366f1' : 'rgba(255, 255, 255, 0.2)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    marginBottom: '0.5rem',
                    boxShadow: isPassed ? '0 0 12px rgba(99, 102, 241, 0.5)' : 'none'
                  }}>
                    {idx + 1}
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: isPassed ? '#f8fafc' : '#64748b' }}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seller Status Update Actions */}
        {isSeller && (
          <div style={{ padding: '1.2rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#f8fafc', marginBottom: '0.8rem' }}>Update Order Status (Seller Control):</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {statusSteps.map((step) => (
                <button
                  key={step}
                  onClick={() => handleUpdateStatus(step)}
                  disabled={updatingStatus || order.orderStatus === step}
                  className={`btn btn-sm ${order.orderStatus === step ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ opacity: order.orderStatus === step ? 0.7 : 1 }}
                >
                  Mark {step}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Items Breakdown */}
        <div style={{ padding: '1.5rem 0' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '1rem' }}>Purchased Items</h3>
          {order.items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.8rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {item.product && item.product.image && (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', background: '#1e293b' }}
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=80'; }}
                  />
                )}
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#f8fafc' }}>
                    {item.product ? item.product.name : 'Product'}
                  </h4>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Quantity: {item.quantity} × ₹{item.price ? item.price.toLocaleString('en-IN') : 0}
                  </span>
                  {item.seller && (
                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#38bdf8', marginTop: '0.2rem' }}>
                      Vendor: {item.seller.name} ({item.seller.email})
                    </span>
                  )}
                </div>
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                ₹{(item.quantity * item.price).toLocaleString('en-IN')}
              </span>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.2rem', fontSize: '1.3rem', fontWeight: 800 }}>
            <span style={{ color: '#ffffff' }}>Total Amount</span>
            <span style={{ color: '#6366f1', fontFamily: 'var(--font-heading)' }}>
              ₹{order.totalAmount ? order.totalAmount.toLocaleString('en-IN') : 0}
            </span>
          </div>
        </div>

        {/* Delivery Address Box */}
        {order.deliveryAddress && (
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={16} color="#ec4899" /> Delivery Destination
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              <strong>{order.deliveryAddress.fullName}</strong> ({order.deliveryAddress.phone})<br />
              {order.deliveryAddress.address}<br />
              {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
