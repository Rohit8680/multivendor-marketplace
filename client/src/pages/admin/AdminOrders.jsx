import React, { useEffect, useState } from 'react';
import API, { getErrorMessage } from '../../services/api';
import OrderCard from '../../components/OrderCard';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await API.get('/admin/orders');
        setOrders(data || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(getErrorMessage(err));
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loading message="Fetching platform orders..." />;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '0.4rem' }}>
        Platform Orders Monitor
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem' }}>
        Monitor all customer orders across all marketplace sellers ({orders.length} orders)
      </p>

      <ErrorMessage message={error} />

      {orders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#ffffff' }}>No Orders Found</h3>
        </div>
      ) : (
        orders.map((order) => <OrderCard key={order._id} order={order} />)
      )}
    </div>
  );
};

export default AdminOrders;
