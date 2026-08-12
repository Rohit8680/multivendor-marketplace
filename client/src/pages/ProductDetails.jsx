import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API, { getErrorMessage } from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import ReviewCard from '../components/ReviewCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { Star, Store, ShoppingCart, Plus, Minus, CheckCircle, AlertCircle, ArrowLeft, Send } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError(null);
      const prodRes = await API.get(`/products/${id}`);
      setProduct(prodRes.data);
      
      try {
        const revRes = await API.get(`/products/${id}/reviews`);
        setReviews(revRes.data || []);
      } catch (revErr) {
        setReviews([]);
      }
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [id]);

  if (loading) return <Loading message="Loading product details..." />;
  if (error || !product) return <ErrorMessage message={error || 'Product not found'} />;

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please log in to add products to your cart.');
      return;
    }
    if (user.role !== 'CUSTOMER') {
      alert('Only customer accounts can add items to cart.');
      return;
    }
    try {
      await addToCart(product._id, quantity);
      alert(`Added ${quantity} unit(s) of '${product.name}' to cart!`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setReviewError('Please log in to submit a review.');
      return;
    }
    try {
      setReviewLoading(true);
      setReviewError(null);
      setReviewSuccess(null);
      await API.post(`/products/${id}/reviews`, { rating, comment });
      setReviewSuccess('Review submitted successfully!');
      setComment('');
      setReviewLoading(false);
      fetchProductData();
    } catch (err) {
      setReviewLoading(false);
      setReviewError(getErrorMessage(err));
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', marginBottom: '1.5rem', fontWeight: 500, fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to Products Catalog
      </Link>

      <div className="glass-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
        {/* Product Image */}
        <div style={{ background: '#1e293b', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=80'; }}
          />
        </div>

        {/* Product Meta & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {product.category && (
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              {product.category.name}
            </span>
          )}

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.8rem', lineHeight: '1.2' }}>
            {product.name}
          </h1>

          {/* Seller Tag */}
          {product.seller && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.5rem 0.9rem', borderRadius: 'var(--radius-sm)', width: 'fit-content', marginBottom: '1rem' }}>
              <Store size={16} color="#6366f1" />
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                Sold by: <strong style={{ color: '#ffffff' }}>{product.seller.name}</strong>
              </span>
            </div>
          )}

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#f59e0b' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  fill={star <= Math.round(product.rating || 0) ? '#f59e0b' : 'none'}
                  color={star <= Math.round(product.rating || 0) ? '#f59e0b' : '#475569'}
                />
              ))}
            </div>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
              {product.rating ? product.rating.toFixed(1) : '0.0'}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              ({product.reviewCount || 0} reviews)
            </span>
          </div>

          {/* Price & Stock */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
              ₹{product.price ? product.price.toLocaleString('en-IN') : 0}
            </span>
            <div style={{ marginTop: '0.4rem' }}>
              {isOutOfStock ? (
                <span className="badge badge-outofstock">OUT OF STOCK</span>
              ) : (
                <span className="badge badge-approved">{product.stock} Units Available</span>
              )}
            </div>
          </div>

          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            {product.description}
          </p>

          {/* Quantity Selector & Add to Cart */}
          <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {!isOutOfStock && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: '#1e293b',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.5rem 0.8rem'
              }}>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  style={{ background: 'transparent', color: '#ffffff', cursor: 'pointer' }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ fontSize: '1rem', fontWeight: 700, minWidth: '30px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  style={{ background: 'transparent', color: '#ffffff', cursor: 'pointer' }}
                >
                  <Plus size={16} />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`btn ${isOutOfStock ? 'btn-secondary' : 'btn-primary'} btn-lg`}
              style={{ flex: 1, opacity: isOutOfStock ? 0.6 : 1, cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}
            >
              <ShoppingCart size={20} />
              {isOutOfStock ? 'OUT OF STOCK' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '1.5rem' }}>
          Customer Reviews ({reviews.length})
        </h2>

        {/* Submit Review Form (Verified Buyers Only) */}
        {user && user.role === 'CUSTOMER' && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.8rem' }}>Write a Customer Review</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
              * Reviews are allowed for customers who have purchased and received this product (Order status must be DELIVERED).
            </p>

            <ErrorMessage message={reviewError} />
            {reviewSuccess && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '1rem' }}>
                {reviewSuccess}
              </div>
            )}

            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label className="form-label">Rating (1 to 5 Stars)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="form-select"
                  style={{ maxWidth: '150px' }}
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Terrible</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Your Review Comment</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share your experience with this product..."
                  className="form-textarea"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <button type="submit" disabled={reviewLoading} className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
                <Send size={15} /> {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {reviews.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No reviews yet for this product.</p>
        ) : (
          reviews.map((rev) => <ReviewCard key={rev._id} review={rev} />)
        )}
      </section>
    </div>
  );
};

export default ProductDetails;
