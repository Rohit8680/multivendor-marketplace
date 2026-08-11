import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Loading marketplace data...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1rem',
      gap: '1rem',
      color: '#94a3b8'
    }}>
      <Loader2 size={36} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{message}</span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
