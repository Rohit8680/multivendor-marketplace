import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API, { getErrorMessage } from '../../services/api';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { ArrowLeft, Save, Upload } from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('0');
  const [image, setImage] = useState('');

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          API.get('/categories'),
          API.get(`/products/${id}`)
        ]);
        setCategories(catRes.data || []);

        const p = prodRes.data;
        setName(p.name);
        setDescription(p.description);
        setPrice(p.price.toString());
        setStock(p.stock.toString());
        setImage(p.image);
        setCategory(p.category ? p.category._id || p.category : '');

        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(getErrorMessage(err));
      }
    };
    fetchData();
  }, [id]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      setError(null);
      const { data } = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImage(data.imageUrl);
      setUploading(false);
    } catch (err) {
      setUploading(false);
      setError(getErrorMessage(err));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      await API.put(`/products/${id}`, {
        name,
        description,
        price: Number(price),
        category,
        stock: Number(stock),
        image
      });

      setSaving(false);
      navigate('/seller/products');
    } catch (err) {
      setSaving(false);
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <Loading message="Loading product data..." />;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <Link to="/seller/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to My Products
      </Link>

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.4rem' }}>
          Edit Marketplace Product
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Update listing details, pricing, or restock inventory quantity.
        </p>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              required
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                required
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Selling Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                className="form-input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Available Stock Quantity *</label>
            <input
              type="number"
              min="0"
              required
              className="form-input"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Product Image URL *</label>
            <input
              type="url"
              required
              className="form-input"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              style={{ marginBottom: '0.8rem' }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', gap: '0.4rem' }}>
                <Upload size={15} /> Change Image File
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
              {uploading && <span style={{ fontSize: '0.85rem', color: '#6366f1' }}>Uploading...</span>}
            </div>

            {image && (
              <div style={{ marginTop: '1rem', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Product Description *</label>
            <textarea
              rows={4}
              required
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1rem', gap: '0.5rem' }}
          >
            <Save size={18} /> {saving ? 'Saving Changes...' : 'Save Product Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
