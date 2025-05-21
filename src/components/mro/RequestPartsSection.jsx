import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Typography } from '@mui/material';

const RequestPartsSection = () => {
  const [partRequests, setPartRequests] = useState([]);
  const [formData, setFormData] = useState({
    requestId: '',
    partName: '',
    quantity: '',
    requiredBy: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPartRequests = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/part-requests');
        const data = await response.json();
        setPartRequests(data);
      } catch (err) {
        console.error('Error fetching part requests:', err);
      }
    };
    fetchPartRequests();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/part-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit request');
      }
      const newRequest = await response.json();
      setPartRequests([...partRequests, newRequest]);
      setFormData({ requestId: '', partName: '', quantity: '', requiredBy: '' });
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ py: 8, px: { xs: 2, sm: 4 } }}>
      <Typography variant="h5" gutterBottom>
        Request New Part
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <TextField
          label="Request ID"
          name="requestId"
          value={formData.requestId}
          onChange={handleInputChange}
          required
          sx={{ m: 1, width: '25ch' }}
        />
        <TextField
          label="Part Name"
          name="partName"
          value={formData.partName}
          onChange={handleInputChange}
          required
          sx={{ m: 1, width: '25ch' }}
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleInputChange}
          required
          sx={{ m: 1, width: '25ch' }}
        />
        <TextField
          label="Required By"
          name="requiredBy"
          type="date"
          value={formData.requiredBy}
          onChange={handleInputChange}
          required
          sx={{ m: 1, width: '25ch' }}
          InputLabelProps={{ shrink: true }}
        />
        <Button type="submit" variant="contained" sx={{ m: 1 }}>
          Submit Request
        </Button>
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '16px',
          boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)',
          overflow: 'hidden',
          maxWidth: '100%',
          '&:hover': {
            boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.15)',
            transition: 'box-shadow 0.3s ease-in-out',
          },
        }}
      >
        <Table sx={{ minWidth: 800 }} aria-label="request parts table">
          <TableHead className="border-b-2">
            <TableRow
              sx={{
                bgcolor: 'linear-gradient(90deg, #1e88e5 0%, #42a5f5 100%)',
                '& th': {
                  color: 'grey.700',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  py: 3,
                  px: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05rem',
                  borderBottom: 'none',
                },
              }}
            >
              <TableCell>ID</TableCell>
              <TableCell>Part Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Required By</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {partRequests.map((request, index) => (
              <TableRow
                key={request.requestId}
                sx={{
                  bgcolor: index % 2 === 0 ? 'white' : 'grey.50',
                  '&:hover': {
                    bgcolor: 'linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)',
                    transition: 'background 0.3s ease-in-out',
                  },
                  cursor: 'pointer',
                  '&:active': {
                    transform: 'scale(0.99)',
                    transition: 'transform 0.1s ease',
                  },
                }}
              >
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  {request.requestId}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  {request.partName}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  {request.quantity}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  {request.requiredBy}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  {request.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RequestPartsSection;