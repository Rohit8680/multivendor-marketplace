import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API, { getErrorMessage } from '../../services/api';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { Plus, Edit, Trash2, Layers, RefreshCw, PackageX } from 'lucide-react';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quick stock update state
  const [updatingId, setUpdatingId] = useState(null);

  const fetchSellerProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get('/seller/products');
      setProducts(data || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const handleStockUpdate = async (productId, newStock) => {
    if (newStock < 0) return;
    try {
      setUpdatingId(productId);
      await API.put(`/products/${productId}`, { stock: newStock });
      setUpdatingId(null);
      fetchSellerProducts();
    } catch (err) {
      setUpdatingId(null);
      alert(getErrorMessage(err));
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${productId}`);
      fetchSellerProducts();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (loading) return <Loading message="Loading seller product listings..." />;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '0.3rem' }}>
            My Products & Inventory
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Manage pricing, categories, and stock levels for your catalog
          </p>
        </div>

        <Link to="/seller/products/add" className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      <ErrorMessage message={error} />

      {products.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <PackageX size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.4rem' }}>No Products Listed</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            You have not added any products to your seller catalog yet.
          </p>
          <Link to="/seller/products/add" className="btn btn-primary">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="table-container glass-panel">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Management</th>
                <th>Status</th>
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
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', background: '#1e293b' }}
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=80'; }}
                      />
                      <div>
                        <strong style={{ color: '#f8fafc', fontSize: '0.95rem', display: 'block' }}>{prod.name}</strong>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Rating: {prod.rating || 0} ★ ({prod.reviewCount || 0})</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info">{prod.category ? prod.category.name : 'N/A'}</span>
                  </td>
                  <td style={{ fontWeight: 700, color: '#ffffff' }}>₹{prod.price ? prod.price.toLocaleString('en-IN') : 0}</td>
                  <td>
                    {/* Quick Stock Counter Update */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <input
                        type="number"
                        min="0"
                        defaultValue={prod.stock}
                        onBlur={(e) => {
                          const val = Number(e.target.value);
                          if (val !== prod.stock) handleStockUpdate(prod._id, val);
                        }}
                        className="form-input"
                        style={{ width: '80px', padding: '0.35rem 0.6rem', fontSize: '0.9rem' }}
                      />
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>units</span>
                    </div>
                  </td>
                  <td>
                    {prod.stock <= 0 ? (
                      <span className="badge badge-outofstock">OUT OF STOCK</span>
                    ) : (
                      <span className="badge badge-approved">AVAILABLE</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/seller/products/edit/${prod._id}`} className="btn btn-secondary btn-sm" title="Edit Product">
                        <Edit size={14} /> Edit
                      </Link>
                      <button onClick={() => handleDelete(prod._id)} className="btn btn-danger btn-sm" title="Delete Product">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
