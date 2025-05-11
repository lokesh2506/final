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

const QualityAssuranceSection = () => {
  const parts = [
    { partName: 'Jet Engine Core', serialNumber: 'ENG-2025-BATCH09', qaResult: 'Pass', certification: 'Certified', remarks: 'Meets ISO aviation specs' },
    { partName: 'Wing Assembly', serialNumber: 'WING-25-B05', qaResult: 'Pending', certification: 'Pending', remarks: 'Awaiting final inspection' },
    { partName: 'Hydraulic Pump', serialNumber: 'HYD-PLU-B12', qaResult: 'Fail', certification: 'Failed', remarks: 'Detected pressure issue' },
  ];

  return (
    <Box sx={{ py: 8, px: { xs: 2, sm: 4 }, }}>
      
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
        <Table sx={{ minWidth: 800 }} aria-label="quality assurance table">
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
              <TableCell>Serial Number</TableCell>
              <TableCell>QA Result</TableCell>
              <TableCell>Certification</TableCell>
              <TableCell>Remarks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parts.map((part, index) => (
              <TableRow
                key={part.serialNumber}
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
                  {part.partName}
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
                  {part.serialNumber}
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
                    label={part.qaResult}
                    size="small"
                    sx={{
                      bgcolor:
                        part.qaResult === 'Pass'
                          ? '#e8f5e9'
                          : part.qaResult === 'Pending'
                          ? '#fffde7'
                          : '#ffebee',
                      color:
                        part.qaResult === 'Pass'
                          ? '#2e7d32'
                          : part.qaResult === 'Pending'
                          ? '#f9a825'
                          : '#d32f2f',
                      fontWeight: 'medium',
                    }}
                  />
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
                    label={part.certification}
                    size="small"
                    sx={{
                      bgcolor:
                        part.certification === 'Certified'
                          ? '#e8f5e9'
                          : part.certification === 'Pending'
                          ? '#fffde7'
                          : '#ffebee',
                      color:
                        part.certification === 'Certified'
                          ? '#2e7d32'
                          : part.certification === 'Pending'
                          ? '#f9a825'
                          : '#d32f2f',
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
                  {part.remarks}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default QualityAssuranceSection;