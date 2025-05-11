
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
} from '@mui/material';

const MRODashboard = () => {
  const mroData = [
    {
      facilityName: 'SkyTech MRO',
      aircraftComponent: 'Boeing 737 - Left Engine',
      serviceType: 'Scheduled Maintenance',
      workOrderNumber: 'WO-2025-001',
      repairDetails: 'Engine overhaul and oil change',
      dateOfService: '2025-04-15',
      partsUsed: 'Serial# ENG-2025-001, Serial# OIL-2025-005',
    },
    {
      facilityName: 'AeroFix MRO',
      aircraftComponent: 'Airbus A320 - Wing Assembly',
      serviceType: 'Emergency Repair',
      workOrderNumber: 'WO-2025-002',
      repairDetails: 'Replaced damaged wing panel',
      dateOfService: '2025-04-14',
      partsUsed: 'Serial# WING-2025-010',
    },
    {
      facilityName: 'AirLine MRO',
      aircraftComponent: 'Boeing 787 - Hydraulic System',
      serviceType: 'Scheduled Maintenance',
      workOrderNumber: 'WO-2025-003',
      repairDetails: 'Inspected and replaced hydraulic pump',
      dateOfService: '2025-04-16',
      partsUsed: 'Serial# HYD-2025-015',
    },
  ];

  return (
    
    <Box sx={{ py: 8, px: { xs: 2, sm: 4 }, bgcolor: 'grey.100' }} className="min-h-[9vh]">
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          color: 'grey.700',
          textAlign: 'center',
          mb: 6,
          fontSize: { xs: '2rem', sm: '2.5rem' },
          letterSpacing: '0.1rem',
        }}
      >
        AIRLINE DASHBOARD
      </Typography>
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
        <Table sx={{ minWidth: 800 }} aria-label="mro airline service log table">
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
              <TableCell>MRO Facility Name</TableCell>
              <TableCell>Aircraft/Component</TableCell>
              <TableCell>Service Type</TableCell>
              <TableCell>Work Order Number</TableCell>
              <TableCell>Repair Details</TableCell>
              <TableCell>Date of Service</TableCell>
              <TableCell>Parts Used</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mroData.map((item, index) => (
              <TableRow
                key={item.workOrderNumber}
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
                  {item.facilityName}
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
                  {item.aircraftComponent}
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
                  {item.serviceType}
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
                  {item.workOrderNumber}
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
                  {item.repairDetails}
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
                  {item.dateOfService}
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
                  {item.partsUsed}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MRODashboard;