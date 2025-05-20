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

const PartsProductionSection = () => {
  const parts = [
    { partName: 'Jet Engine Core', serialBatch: 'ENG-2025-BATCH09', status: 'Quality Check', manufacturingDate: '2025-04-10', deliveryTime: '2025-04-20' },
    { partName: 'Wing Assembly', serialBatch: 'WING-25-B05', status: 'In Progress', manufacturingDate: '2025-04-09', deliveryTime: '2025-04-21' },
    { partName: 'Hydraulic Pump', serialBatch: 'HYD-PLU-B12', status: 'Ready for Ship', manufacturingDate: '2025-04-08', deliveryTime: '2025-04-18' },
  ];

  return (
    <Box sx={{ py: 8, px: { xs: 2, sm: 4 },  }}>
      
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
        <Table sx={{ minWidth: 800 }} aria-label="parts production table">
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
              <TableCell>Serial/Batch No.</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Manufacturing Date</TableCell>
              <TableCell>MRO's Required Delivery Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parts.map((part, index) => (
              <TableRow
                key={part.serialBatch}
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
                  {part.serialBatch}
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
                    label={part.status}
                    size="small"
                    sx={{
                      bgcolor:
                        part.status === 'Quality Check'
                          ? '#fffde7'
                          : part.status === 'In Progress'
                          ? '#e8f5e9'
                          : '#e0f7fa',
                      color:
                        part.status === 'Quality Check'
                          ? '#f9a825'
                          : part.status === 'In Progress'
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
                  {part.manufacturingDate}
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
                  {part.deliveryTime}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PartsProductionSection;