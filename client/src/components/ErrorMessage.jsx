import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div style={{
      background: 'rgba(244, 63, 94, 0.12)',
      border: '1px solid rgba(244, 63, 94, 0.3)',
      borderRadius: 'var(--radius-sm)',
      padding: '0.85rem 1.2rem',
      color: '#f43f5e',
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      fontSize: '0.9rem',
      margin: '1rem 0'
    }}>
      <AlertCircle size={18} />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
