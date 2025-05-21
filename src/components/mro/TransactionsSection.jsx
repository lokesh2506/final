import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const TransactionsSection = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mrotransactions');
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };
    fetchTransactions();
  }, []);

  const handleVerify = async (txnId) => {
    try {
      const audit = {
        auditId: `AUD-${Date.now()}`,
        entity: 'Transaction',
        audited: txnId,
        date: new Date().toISOString().split('T')[0],
        outcome: 'Verified',
        notes: `Transaction ${txnId} verified`,
      };
      const response = await fetch('http://localhost:5000/api/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(audit),
      });
      if (!response.ok) {
        throw new Error('Failed to create audit record');
      }
      alert(`Transaction ${txnId} verified and audit record created`);
    } catch (err) {
      console.error('Error verifying transaction:', err);
      alert('Failed to verify transaction');
    }
  };

  return (
    <Box sx={{ py: 8, px: { xs: 2, sm: 4 } }}>
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
        <Table sx={{ minWidth: 800 }} aria-label="transactions table">
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
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Part Name</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((txn, index) => (
              <TableRow
                key={txn.txnId}
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
                  {txn.txnId}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  {txn.date}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  {txn.action}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  {txn.partName}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  {txn.notes}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  <Button onClick={() => handleVerify(txn.txnId)}>Verify</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransactionsSection;