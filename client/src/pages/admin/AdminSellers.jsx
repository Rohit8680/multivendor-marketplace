import React, { useEffect, useState } from 'react';
import API, { getErrorMessage } from '../../services/api';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { Store, Check, X, Clock } from 'lucide-react';

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = filterStatus ? `/admin/sellers?status=${filterStatus}` : '/admin/sellers';
      const { data } = await API.get(url);
      setSellers(data || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [filterStatus]);

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await API.put(`/admin/sellers/${id}/approve`);
      setActionLoading(null);
      fetchSellers();
    } catch (err) {
      setActionLoading(null);
      alert(getErrorMessage(err));
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(id);
      await API.put(`/admin/sellers/${id}/reject`);
      setActionLoading(null);
      fetchSellers();
    } catch (err) {
      setActionLoading(null);
      alert(getErrorMessage(err));
    }
  };

  if (loading) return <Loading message="Fetching sellers list..." />;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '0.3rem' }}>
            Seller Management & Approvals
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Review vendor registrations and grant product creation permissions
          </p>
        </div>

        {/* Status Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setFilterStatus('')}
            className={`btn btn-sm ${filterStatus === '' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Sellers
          </button>
          <button
            onClick={() => setFilterStatus('PENDING')}
            className={`btn btn-sm ${filterStatus === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus('APPROVED')}
            className={`btn btn-sm ${filterStatus === 'APPROVED' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilterStatus('REJECTED')}
            className={`btn btn-sm ${filterStatus === 'REJECTED' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Rejected
          </button>
        </div>
      </div>

      <ErrorMessage message={error} />

      {sellers.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Store size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.3rem', color: '#ffffff' }}>No Sellers Found</h3>
        </div>
      ) : (
        <div className="table-container glass-panel">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Seller Name</th>
                <th>Email Address</th>
                <th>Registration Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller._id}>
                  <td style={{ fontWeight: 600, color: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Store size={16} color="#6366f1" />
                      {seller.name}
                    </div>
                  </td>
                  <td style={{ color: '#cbd5e1' }}>{seller.email}</td>
                  <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                    {new Date(seller.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    {seller.sellerStatus === 'APPROVED' ? (
                      <span className="badge badge-approved">APPROVED</span>
                    ) : seller.sellerStatus === 'REJECTED' ? (
                      <span className="badge badge-rejected">REJECTED</span>
                    ) : (
                      <span className="badge badge-pending">PENDING</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {seller.sellerStatus !== 'APPROVED' && (
                        <button
                          onClick={() => handleApprove(seller._id)}
                          disabled={actionLoading === seller._id}
                          className="btn btn-success btn-sm"
                          style={{ gap: '0.3rem' }}
                        >
                          <Check size={14} /> Approve
                        </button>
                      )}
                      {seller.sellerStatus !== 'REJECTED' && (
                        <button
                          onClick={() => handleReject(seller._id)}
                          disabled={actionLoading === seller._id}
                          className="btn btn-danger btn-sm"
                          style={{ gap: '0.3rem' }}
                        >
                          <X size={14} /> Reject
                        </button>
                      )}
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

export default AdminSellers;
