import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API, { getErrorMessage } from '../../services/api';
import ErrorMessage from '../../components/ErrorMessage';
import { ArrowLeft, Plus, Upload, Link as LinkIcon } from 'lucide-react';

const AddProduct = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('10');
  const [image, setImage] = useState('');

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/categories');
        setCategories(data || []);
        if (data && data.length > 0) {
          setCategory(data[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

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

    if (!image) {
      setError('Please provide a product image URL or upload an image file');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await API.post('/products', {
        name,
        description,
        price: Number(price),
        category,
        stock: Number(stock),
        image
      });

      setLoading(false);
      navigate('/seller/products');
    } catch (err) {
      setLoading(false);
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <Link to="/seller/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to My Products
      </Link>

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.4rem' }}>
          Add New Marketplace Product
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Fill in product details, pricing, and available stock quantity.
        </p>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Ergonomic Bluetooth Headphones"
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
                placeholder="199.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Initial Stock Quantity *</label>
            <input
              type="number"
              min="0"
              required
              className="form-input"
              placeholder="10"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          {/* Image Input Options */}
          <div className="form-group">
            <label className="form-label">Product Image (URL or File Upload) *</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://images.unsplash.com/... or paste image link"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              style={{ marginBottom: '0.8rem' }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', gap: '0.4rem' }}>
                <Upload size={15} /> Upload Image File
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
              {uploading && <span style={{ fontSize: '0.85rem', color: '#6366f1' }}>Uploading image...</span>}
            </div>

            {image && (
              <div style={{ marginTop: '1rem', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
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
              placeholder="Provide a detailed description of features, materials, and warranty..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1rem', gap: '0.5rem' }}
          >
            <Plus size={18} /> {loading ? 'Creating Product...' : 'Publish Product to Marketplace'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
