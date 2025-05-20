import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAdminContract } from '../blockchain/AdminContract'; // optional
import { toast } from 'react-toastify';

const roleLabels = {
  0: 'Supplier',
  1: 'Manufacturer',
  2: 'MRO',
  3: 'Airline',
  4: 'Regulatory Authority'
};

const VerificationRequests = () => {
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchVerificationRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/verification/requests');
      setVerificationRequests(response.data);
      applyFilter(response.data, statusFilter);
    } catch (err) {
      console.error("Error fetching verification requests:", err);
      setError('❌ Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (requests, filter) => {
    if (filter === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter((r) => r.status === filter));
    }
  };

  const handleVerification = async (walletAddress, role, status) => {
    try {
      // ✅ Choose one method: Smart Contract OR REST
      // const contract = await getAdminContract();
      // const tx = status === 'approved'
      //   ? await contract.approveVerification(walletAddress, parseInt(role))
      //   : await contract.rejectVerification(walletAddress, parseInt(role));
      // await tx.wait();

      // OR use REST backend:
      await axios.post('http://localhost:5000/api/verification/approve', {
        walletAddress,
        role,
        status,
      });

      toast.success(`✅ Request ${status}`);
      fetchVerificationRequests();
    } catch (err) {
      console.error(err);
      toast.error(`❌ Failed to ${status}: ${err.message}`);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    applyFilter(verificationRequests, value);
  };

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-yellow-400">🛡️ Admin Dashboard - Verification Requests</h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <label htmlFor="statusFilter" className="text-lg font-semibold">Filter:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={handleFilterChange}
              className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button
            onClick={fetchVerificationRequests}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded shadow"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && filteredRequests.length === 0 && (
          <p className="text-center text-gray-400">No verification requests found.</p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-gray-800 rounded-lg shadow">
            <thead className="bg-gray-700 text-gray-300">
              <tr>
                <th className="p-3 text-left">Wallet Address</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Requested At</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((r, idx) => (
                <tr key={`${r.walletAddress}-${r.role}`} className="border-t border-gray-700 hover:bg-gray-700/40">
                  <td className="p-3">{r.walletAddress}</td>
                  <td className="p-3">{roleLabels[r.role] || r.role}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold 
                      ${r.status === 'approved' ? 'bg-green-600' : r.status === 'pending' ? 'bg-yellow-500 text-black' : 'bg-red-500'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="p-3">
                    {r.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                          onClick={() => handleVerification(r.walletAddress, r.role, 'approved')}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                          onClick={() => handleVerification(r.walletAddress, r.role, 'rejected')}
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

        <p className="text-sm text-center mt-8 text-gray-500">
          Powered by <span className="text-yellow-400">MetaMask</span> & Blockchain Verification 🚀
        </p>
      </div>
    </div>
  );
};

export default VerificationRequests;
