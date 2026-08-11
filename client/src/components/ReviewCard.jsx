import React from 'react';
import { Star, User } from 'lucide-react';

const ReviewCard = ({ review }) => {
  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="glass-panel" style={{ padding: '1rem 1.2rem', marginBottom: '0.8rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.2)',
            padding: '0.4rem',
            borderRadius: '9999px',
            color: '#6366f1',
            display: 'flex',
            alignItems: 'center'
          }}>
            <User size={14} />
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>
            {review.user ? review.user.name : 'Verified Buyer'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              fill={star <= review.rating ? '#f59e0b' : 'none'}
              color={star <= review.rating ? '#f59e0b' : '#475569'}
            />
          ))}
        </div>
      </div>

      <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '0.4rem' }}>
        "{review.comment}"
      </p>

      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
        Reviewed on {formattedDate}
      </span>
    </div>
  );
};

export default ReviewCard;
