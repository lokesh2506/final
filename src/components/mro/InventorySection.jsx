import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const inventoryData = [
  { id: 'ENG-JC00123', partName: 'Jet Engine Core', serialNumber: 'ENG-JC00123', condition: 'New', quantity: 1, lastUsed: '2025-04-09' },
  { id: 'LG-AX4432', partName: 'Landing Gear Set', serialNumber: 'LG-AX4432', condition: 'Old but working', quantity: 2, lastUsed: '2025-04-10' },
];

const InventorySection = ({ setActiveSection }) => {
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
        <Table sx={{ minWidth: 800 }} aria-label="inventory table">
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
              <TableCell>Serial Number</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Quantity Available</TableCell>
              <TableCell>Last Used</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryData.map((item, index) => (
              <TableRow
                key={item.id}
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
                  {item.id}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  {item.partName}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  {item.serialNumber}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  {item.condition}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  {item.quantity}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  {item.lastUsed}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  <Button>Log Usage</Button>
                  <Button onClick={() => setActiveSection('RequestParts')}>Request More</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InventorySection;
