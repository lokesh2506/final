import React, { useState, useEffect } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import {
  Container,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Box,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { toast } from 'react-toastify';
import RefreshIcon from '@mui/icons-material/Refresh';

// Debug: Log React instance
console.log('React instance in VerificationRequests.jsx:', React);

const VerificationRequests = () => {
  const { account, contracts, connectWallet, networkError } = useBlockchain();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Debug: Log state on render
  console.log('Rendering VerificationRequests - Account:', account, 'Contracts.admin:', contracts.admin);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/verification/requests');
      const formattedRequests = response.data.map((request, index) => ({
        id: index,
        walletAddress: request.walletAddress,
        role: request.role,
        status: request.status,
        createdAt: new Date(request.createdAt).toLocaleString(),
        updatedAt: new Date(request.updatedAt).toLocaleString(),
      }));
      setRequests(formattedRequests);
      setFilteredRequests(formattedRequests);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      toast.error('Failed to fetch verification requests');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    let filtered = requests;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter((request) =>
        request.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, requests]);

  const handleAction = async (walletAddress, role, action) => {
    try {
      const response = await axios.post('http://localhost:5000/api/verification/approve', {
        walletAddress,
        role,
        status: action,
      });

      if (response.data.success) {
        toast.success(`Request ${action} successfully`);
        fetchRequests();
      } else {
        toast.error(`Failed to ${action} request`);
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast.error(`Failed to ${action} request: ${error.response?.data?.error || error.message}`);
    }
  };

  const columns = [
    { field: 'walletAddress', headerName: 'Wallet Address', width: 300 },
    { field: 'role', headerName: 'Role', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'createdAt', headerName: 'Created At', width: 200 },
    { field: 'updatedAt', headerName: 'Updated At', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          {params.row.status === 'pending' && (
            <>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleAction(params.row.walletAddress, params.row.role, 'approved')}
                sx={{ mr: 1 }}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => handleAction(params.row.walletAddress, params.row.role, 'rejected')}
              >
                Reject
              </Button>
            </>
          )}
        </>
      ),
    },
  ];

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  if (!account) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Please connect your wallet.
        </Typography>
        {networkError && (
          <Typography variant="body1" color="error" sx={{ mt: 2 }}>
            {networkError}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={connectWallet}
          sx={{ mt: 2 }}
        >
          Connect Wallet
        </Button>
      </Container>
    );
  }

  if (!contracts.admin) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Admin contract not initialized.
        </Typography>
        {networkError && (
          <Typography variant="body1" color="error" sx={{ mt: 2 }}>
            {networkError}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={connectWallet}
          sx={{ mt: 2 }}
        >
          Retry Connection
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard - Verification Requests
          </Typography>
          <Typography variant="body1">
            Connected Account: {account}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={3}>
          <TextField
            label="Search by Wallet Address"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: '30%' }}
          />
          <FormControl sx={{ width: '20%' }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Filter by Status"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchRequests}
            sx={{ height: 'fit-content' }}
          >
            Refresh
          </Button>
        </Box>

        {filteredRequests.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
            No verification requests found.
          </Typography>
        ) : (
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={filteredRequests}
              columns={columns}
              pageSize={rowsPerPage}
              rowsPerPageOptions={[5, 10, 20]}
              onPageSizeChange={(newPageSize) => setRowsPerPage(newPageSize)}
              page={page}
              onPageChange={(newPage) => setPage(newPage)}
              pagination
              disableSelectionOnClick
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default VerificationRequests;