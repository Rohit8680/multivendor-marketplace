import React, { useEffect, useState } from 'react';
import API, { getErrorMessage } from '../../services/api';
import OrderCard from '../../components/OrderCard';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { ShoppingBag, CheckCircle } from 'lucide-react';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get('/seller/orders');
      setOrders(data || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  if (loading) return <Loading message="Loading customer orders..." />;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '0.4rem' }}>
        Seller Orders
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem' }}>
        Customer orders containing your products (Order items are isolated to your vendor account)
      </p>

      <ErrorMessage message={error} />

      {orders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <ShoppingBag size={54} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.4rem' }}>No Active Orders</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            When customers order your products, their orders will appear here for fulfillment.
          </p>
        </div>
      ) : (
        orders.map((order) => (
          <OrderCard key={order._id} order={order} isSellerView={true} />
        ))
      )}
    </div>
  );
};

export default SellerOrders;
