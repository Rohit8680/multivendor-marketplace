import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, MapPin, ChevronRight, Store } from 'lucide-react';

const getStatusBadge = (status) => {
  switch (status) {
    case 'PLACED':
      return <span className="badge badge-placed">PLACED</span>;
    case 'CONFIRMED':
      return <span className="badge badge-confirmed">CONFIRMED</span>;
    case 'SHIPPED':
      return <span className="badge badge-shipped">SHIPPED</span>;
    case 'DELIVERED':
      return <span className="badge badge-delivered">DELIVERED</span>;
    default:
      return <span className="badge badge-info">{status}</span>;
  }
};

const OrderCard = ({ order, isSellerView = false }) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.8rem',
        paddingBottom: '0.8rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Package size={20} color="#6366f1" />
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Order #</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginLeft: '0.3rem' }}>
              {order._id.substring(order._id.length - 8).toUpperCase()}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#94a3b8' }}>
            <Clock size={14} />
            <span>{formattedDate}</span>
          </div>
          {order.paymentMethod === 'RAZORPAY' ? (
            <span className="badge badge-approved">RAZORPAY ONLINE</span>
          ) : (
            <span className="badge badge-info">COD</span>
          )}
          {getStatusBadge(order.orderStatus)}
        </div>
      </div>

      {/* Order Items List */}
      <div style={{ padding: '1rem 0' }}>
        {order.items.map((item, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '0.6rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              {item.product && item.product.image && (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }}
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=80'; }}
                />
              )}
              <div>
                <h5 style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600 }}>
                  {item.product ? item.product.name : 'Product'}
                </h5>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Qty: {item.quantity} × ₹{item.price ? item.price.toLocaleString('en-IN') : 0}
                </span>
                {item.seller && (
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#38bdf8' }}>
                    Seller: {item.seller.name}
                  </span>
                )}
              </div>
            </div>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
              ₹{(item.quantity * item.price).toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.8rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        flexWrap: 'wrap',
        gap: '0.8rem'
      }}>
        <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MapPin size={15} color="#ec4899" />
          <span>
            Deliver to: <strong style={{ color: '#cbd5e1' }}>{order.deliveryAddress ? `${order.deliveryAddress.fullName}, ${order.deliveryAddress.city}` : 'Customer'}</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>
              {isSellerView ? 'Seller Subtotal' : 'Total Amount'}
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#6366f1', fontFamily: 'var(--font-heading)' }}>
              ₹{isSellerView && order.sellerSubtotal ? order.sellerSubtotal.toLocaleString('en-IN') : order.totalAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm" style={{ gap: '0.3rem' }}>
            View Details <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
