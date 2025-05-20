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

const MaterialInventorySection = () => {
  const materials = [
    { materialName: 'Titanium Alloy', supplier: 'AlloyForge Inc.', qtyReceived: '1500 kg', qtyUsed: '600 kg', condition: 'Good' },
    { materialName: 'Carbon Fiber', supplier: 'NanoFiber Co.', qtyReceived: '800 kg', qtyUsed: '500 kg', condition: 'Good' },
    { materialName: 'Aluminum Sheet', supplier: 'SheetMakers Ltd.', qtyReceived: '1200 kg', qtyUsed: '0 kg', condition: 'Needs Recheck' },
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
        <Table sx={{ minWidth: 800 }} aria-label="material inventory table">
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
              <TableCell>Material Name</TableCell>
              <TableCell>Supplier Name</TableCell>
              <TableCell>Qty Received</TableCell>
              <TableCell>Qty Used</TableCell>
              <TableCell>Condition</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.map((material, index) => (
              <TableRow
                key={material.materialName}
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
                  {material.materialName}
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
                  {material.supplier}
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
                  {material.qtyReceived}
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
                  {material.qtyUsed}
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
                    label={material.condition}
                    size="small"
                    sx={{
                      bgcolor: material.condition === 'Good' ? '#e8f5e9' : '#fffde7',
                      color: material.condition === 'Good' ? '#2e7d32' : '#f9a825',
                      fontWeight: 'medium',
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MaterialInventorySection;