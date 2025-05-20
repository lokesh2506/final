import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VerificationRequests = () => {
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [notification, setNotification] = useState({ message: '', type: '' });

  const fetchVerificationRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/verification/requests');
      if (response.data.length === 0) {
        setNotification({ message: 'No verification requests found in the database.', type: 'info' });
      }
      setVerificationRequests(response.data);
      applyFilter(response.data, statusFilter);
    } catch (err) {
      console.error("Error fetching verification requests:", err);
      setError(`Failed to load verification requests: ${err.message}`);
      setNotification({ message: `Failed to load verification requests: ${err.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (requests, filter) => {
    if (filter === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter((req) => req.status === filter));
    }
  };

  const handleVerification = async (walletAddress, role, status) => {
    try {
      const response = await axios.post('http://localhost:5000/api/verification/approve', {
        walletAddress,
        role,
        status,
      });
      setNotification({ message: `Request ${status} successfully!`, type: 'success' });
      fetchVerificationRequests();
    } catch (err) {
      console.error(`Error ${status}ing request:`, err);
      setNotification({ message: `Failed to ${status} request: ${err.message}`, type: 'error' });
    }
  };

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setStatusFilter(newFilter);
    applyFilter(verificationRequests, newFilter);
  };

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Admin Dashboard - Verification Requests</h1>

        {notification.message && (
          <div
            className={`mb-4 p-4 rounded-lg text-center ${
              notification.type === 'success'
                ? 'bg-green-500'
                : notification.type === 'error'
                ? 'bg-red-500'
                : 'bg-blue-500'
            } text-white`}
          >
            {notification.message}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div>
            <label htmlFor="statusFilter" className="mr-2">Filter by Status:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={handleFilterChange}
              className="bg-gray-800 text-white p-2 rounded"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button
            onClick={fetchVerificationRequests}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {filteredRequests.length === 0 && !loading && !error && (
          <p className="text-center">No verification requests match the current filter.</p>
        )}

        {filteredRequests.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg">
              <thead>
                <tr>
                  <th className="p-4 text-left">Wallet Address</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Created At</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={`${request.walletAddress}-${request.role}`} className="border-t border-gray-700">
                    <td className="p-4">{request.walletAddress}</td>
                    <td className="p-4">{request.role}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded ${
                          request.status === 'pending'
                            ? 'bg-yellow-500'
                            : request.status === 'approved'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        } text-white`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="p-4">{new Date(request.createdAt).toLocaleString()}</td>
                    <td className="p-4">
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleVerification(request.walletAddress, request.role, 'approved')}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerification(request.walletAddress, request.role, 'rejected')}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationRequests;