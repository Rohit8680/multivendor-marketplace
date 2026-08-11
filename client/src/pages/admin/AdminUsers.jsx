import React, { useEffect, useState } from 'react';
import API, { getErrorMessage } from '../../services/api';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { Users, Mail, Shield, Store } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await API.get('/admin/users');
        setUsers(data || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(getErrorMessage(err));
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <Loading message="Fetching marketplace users..." />;

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '0.4rem' }}>
        Registered Users Directory
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem' }}>
        Platform account registry ({users.length} accounts total)
      </p>

      <ErrorMessage message={error} />

      <div className="table-container glass-panel">
        <table className="custom-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status (Sellers)</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td style={{ fontWeight: 600, color: '#f8fafc' }}>{u.name}</td>
                <td style={{ color: '#cbd5e1' }}>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : u.role === 'SELLER' ? 'badge-info' : 'badge-placed'}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  {u.role === 'SELLER' ? (
                    u.sellerStatus === 'APPROVED' ? (
                      <span className="badge badge-approved">APPROVED</span>
                    ) : u.sellerStatus === 'REJECTED' ? (
                      <span className="badge badge-rejected">REJECTED</span>
                    ) : (
                      <span className="badge badge-pending">PENDING</span>
                    )
                  ) : (
                    <span style={{ color: '#64748b' }}>—</span>
                  )}
                </td>
                <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
