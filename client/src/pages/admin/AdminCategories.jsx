import React, { useEffect, useState } from 'react';
import API, { getErrorMessage } from '../../services/api';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { Layers, Plus, Trash2, Edit } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get('/categories');
      setCategories(data || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      if (editingId) {
        await API.put(`/categories/${editingId}`, { name, description, image });
      } else {
        await API.post('/categories', { name, description, image });
      }
      setName('');
      setDescription('');
      setImage('');
      setEditingId(null);
      setSubmitting(false);
      fetchCategories();
    } catch (err) {
      setSubmitting(false);
      setError(getErrorMessage(err));
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
    setDescription(cat.description || '');
    setImage(cat.image || '');
  };

  const handleDelete = async (catId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await API.delete(`/categories/${catId}`);
      fetchCategories();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (loading) return <Loading message="Loading category listings..." />;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '0.4rem' }}>
        Category Management
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem' }}>
        Add and manage product categories for seller listings
      </p>

      <ErrorMessage message={error} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Category Form */}
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '1.8rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} color="#38bdf8" /> {editingId ? 'Edit Category' : 'Create New Category'}
          </h3>

          <div className="form-group">
            <label className="form-label">Category Name *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Electronics"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows={3}
              className="form-textarea"
              placeholder="Brief description of products in this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem' }}>
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1, gap: '0.4rem' }}>
              <Plus size={16} /> {submitting ? 'Saving...' : editingId ? 'Update Category' : 'Add Category'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setName(''); setDescription(''); setImage(''); }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Categories List */}
        <div className="table-container glass-panel">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Slug</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <strong style={{ color: '#f8fafc' }}>{cat.name}</strong>
                    </div>
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{cat.slug}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button onClick={() => handleEdit(cat)} className="btn btn-secondary btn-sm" title="Edit">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(cat._id)} className="btn btn-danger btn-sm" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
