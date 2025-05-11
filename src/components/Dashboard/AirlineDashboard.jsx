
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

const AirlineDashboard = () => {
  const airlineData = [
    {
      airlineName: 'SkyHigh Airlines',
      aircraftInfo: 'Aircraft ID: B737-001, Flight AA123 (JFK → LAX)',
      partsInstalled: 'Jet Engine (Serial# ENG-2025-001), Landing Gear (Serial# LG-2025-003)',
      maintenanceHistory: '2025-04-15: Engine overhaul by SkyTech MRO',
      flightHours: '3200 hrs',
    },
    {
      airlineName: 'GlobalJet Airways',
      aircraftInfo: 'Aircraft ID: A320-002, Flight GJ456 (LHR → CDG)',
      partsInstalled: 'Wing Assembly (Serial# WING-2025-010), Hydraulic Pump (Serial# HYD-2025-015)',
      maintenanceHistory: '2025-04-14: Wing repair by AeroFix MRO',
      flightHours: '2800 hrs',
    },
    {
      airlineName: 'BlueSky Airlines',
      aircraftInfo: 'Aircraft ID: B787-003, Flight BS789 (SFO → NRT)',
      partsInstalled: 'Hydraulic System (Serial# HYD-2025-015), Avionics Unit (Serial# AV-2025-007)',
      maintenanceHistory: '2025-04-16: Hydraulic maintenance by AirLine MRO',
      flightHours: '3500 hrs',
    },
  ];

  return (
    <Box sx={{ py: 8, px: { xs: 2, sm: 4 }, bgcolor: 'grey.100' }} className="min-h-[92vh]">
      
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
        <Table sx={{ minWidth: 800 }} aria-label="airline operations log table">
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
              <TableCell>Airline Name</TableCell>
              <TableCell>Aircraft ID/Flight Info</TableCell>
              <TableCell>Parts Installed</TableCell>
              <TableCell>Maintenance History</TableCell>
              <TableCell>Flight Hours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {airlineData.map((item, index) => (
              <TableRow
                key={`${item.airlineName}-${item.aircraftInfo}`}
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
                  {item.airlineName}
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
                  {item.aircraftInfo}
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
                  {item.partsInstalled}
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
                  {item.maintenanceHistory}
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
                  {item.flightHours}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AirlineDashboard;