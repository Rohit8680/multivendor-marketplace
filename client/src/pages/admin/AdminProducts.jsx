import React, { useEffect, useState } from 'react';
import API, { getErrorMessage } from '../../services/api';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { Package, Trash2, Store } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get('/admin/products');
      setProducts(data || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Admin Audit: Remove this product from the marketplace?')) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (loading) return <Loading message="Auditing platform products..." />;

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '0.4rem' }}>
        Platform Products Audit
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem' }}>
        View and moderate products listed across all seller accounts ({products.length} products total)
      </p>

      <ErrorMessage message={error} />

      <div className="table-container glass-panel">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Vendor / Seller</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <img
                      src={prod.image}
                      alt={prod.name}
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', background: '#1e293b' }}
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=80'; }}
                    />
                    <strong style={{ color: '#f8fafc' }}>{prod.name}</strong>
                  </div>
                </td>
                <td>
                  <span className="badge badge-info">{prod.category ? prod.category.name : 'N/A'}</span>
                </td>
                <td>
                  {prod.seller && (
                    <div style={{ fontSize: '0.85rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Store size={14} />
                      <span>{prod.seller.name}</span>
                    </div>
                  )}
                </td>
                <td style={{ fontWeight: 700, color: '#ffffff' }}>₹{prod.price ? prod.price.toLocaleString('en-IN') : 0}</td>
                <td>
                  {prod.stock <= 0 ? (
                    <span className="badge badge-outofstock">OUT OF STOCK</span>
                  ) : (
                    <span>{prod.stock} units</span>
                  )}
                </td>
                <td>
                  <button onClick={() => handleDelete(prod._id)} className="btn btn-danger btn-sm" title="Remove Product">
                    <Trash2 size={14} /> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
