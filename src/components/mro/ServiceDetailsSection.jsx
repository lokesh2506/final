import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ServiceDetailsSection = () => {
  const details = [
    {
      id: 'WO-2025-003',
      partName: 'Jet Engine Core',
      serviceType: 'Overhaul',
      technician: 'John Doe',
      status: 'In Progress',
      completionDate: '2025-04-15',
    },
    {
      id: 'WO-2025-004',
      partName: 'Landing Gear',
      serviceType: 'Inspection',
      technician: 'Jane Smith',
      status: 'Completed',
      completionDate: '2025-04-11',
    },
  ];

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
        <Table sx={{ minWidth: 800 }} aria-label="service details table">
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
              <TableCell>Service Type</TableCell>
              <TableCell>Technician</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Completion Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {details.map((detail, index) => (
              <TableRow
                key={detail.id}
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
                  {detail.id}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  {detail.partName}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  {detail.serviceType}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  {detail.technician}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  {detail.status}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem', color: 'grey.900', py: 2.5, px: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  {detail.completionDate}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ServiceDetailsSection;
