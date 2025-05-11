import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
} from '@mui/material';

const ShipmentManagementSection = () => {
  const shipments = [
    { partName: 'Jet Engine Core', recipient: 'SkyTech MRO', quantity: '5 units', shipDate: '2025-04-11', status: 'In Transit', trackingId: 'SHP123456789' },
    { partName: 'Wing Assembly', recipient: 'AirFix MRO', quantity: '3 units', shipDate: '2025-04-09', status: 'Delivered', trackingId: 'SHP123456780' },
    { partName: 'Hydraulic Pump', recipient: 'AeroLine Ltd.', quantity: '4 units', shipDate: '2025-04-10', status: 'Dispatched', trackingId: 'SHP123456781' },
  ];

  return (
    <Box sx={{ py: 8, px: { xs: 2, sm: 4 },}}>
      
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
        <Table sx={{ minWidth: 800 }} aria-label="shipment management table">
          <TableHead className='border-b-2'>
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
              <TableCell>Part Name</TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Ship Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tracking ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.map((shipment, index) => (
              <TableRow
                key={shipment.trackingId}
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
                <TableCell
                  sx={{
                    fontSize: '1.1rem',
                    color: 'grey.900',
                    py: 2.5,
                    px: 4,
                    borderBottom: '1px solid',
                    borderColor: 'grey.200',
                  }}
                >
                  {shipment.partName}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '1.1rem',
                    color: 'grey.900',
                    py: 2.5,
                    px: 4,
                    borderBottom: '1px solid',
                    borderColor: 'grey.200',
                  }}
                >
                  {shipment.recipient}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '1.1rem',
                    color: 'grey.900',
                    py: 2.5,
                    px: 4,
                    borderBottom: '1px solid',
                    borderColor: 'grey.200',
                  }}
                >
                  {shipment.quantity}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '1.1rem',
                    color: 'grey.900',
                    py: 2.5,
                    px: 4,
                    borderBottom: '1px solid',
                    borderColor: 'grey.200',
                  }}
                >
                  {shipment.shipDate}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '1.1rem',
                    py: 2.5,
                    px: 4,
                    borderBottom: '1px solid',
                    borderColor: 'grey.200',
                  }}
                >
                  <Chip
                    label={shipment.status}
                    size="small"
                    sx={{
                      bgcolor:
                        shipment.status === 'In Transit'
                          ? '#fffde7'
                          : shipment.status === 'Delivered'
                          ? '#e8f5e9'
                          : '#e0f7fa',
                      color:
                        shipment.status === 'In Transit'
                          ? '#f9a825'
                          : shipment.status === 'Delivered'
                          ? '#2e7d32'
                          : '#0288d1',
                      fontWeight: 'medium',
                    }}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '1.1rem',
                    color: 'grey.900',
                    py: 2.5,
                    px: 4,
                    borderBottom: '1px solid',
                    borderColor: 'grey.200',
                  }}
                >
                  {shipment.trackingId}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ShipmentManagementSection;