import React, { useEffect, useState } from 'react';
import API from '../services/api';
import OrderCard from '../components/OrderCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { Package, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/orders');
        setOrders(data || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Failed to fetch order history');
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.4rem' }}>
        My Orders
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Track your placed orders and delivery status.
      </p>

      <ErrorMessage message={error} />

      {loading ? (
        <Loading message="Fetching your orders..." />
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Package size={54} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.4rem' }}>No Orders Placed Yet</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            When you purchase products from sellers, your orders will appear here.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg" style={{ gap: '0.5rem' }}>
            <ArrowLeft size={18} /> Browse Marketplace Products
          </Link>
        </div>
      ) : (
        orders.map((order) => <OrderCard key={order._id} order={order} />)
      )}
    </div>
  );
};

export default OrdersPage;
