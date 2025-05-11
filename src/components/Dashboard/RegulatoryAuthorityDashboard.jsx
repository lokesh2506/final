
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

const RegulatoryAuthorityDashboard = () => {
  const regulatoryData = [
    {
      authorityName: 'FAA',
      regulations: 'FAR Part 25 - Airworthiness Standards',
      certificationData: 'Certified Jet Engine (Serial# ENG-2025-001) on 2025-04-10',
      inspectionData: 'Inspected Boeing 737 (ID: B737-001) on 2025-04-12 - Passed',
      auditHistory: 'Audit of SkyTech MRO on 2025-04-15 - Compliant',
      violationRecords: 'None',
    },
    {
      authorityName: 'EASA',
      regulations: 'EASA Part M - Continuing Airworthiness',
      certificationData: 'Certified Wing Assembly (Serial# WING-2025-010) on 2025-04-11',
      inspectionData: 'Inspected Airbus A320 (ID: A320-002) on 2025-04-13 - Minor Issues Noted',
      auditHistory: 'Audit of AeroFix MRO on 2025-04-16 - Compliant with Recommendations',
      violationRecords: 'Minor Violation: AeroFix MRO - Late Submission of Records (2025-04-14)',
    },
    {
      authorityName: 'FAA',
      regulations: 'FAR Part 43 - Maintenance Requirements',
      certificationData: 'Certified Hydraulic System (Serial# HYD-2025-015) on 2025-04-09',
      inspectionData: 'Inspected Boeing 787 (ID: B787-003) on 2025-04-14 - Passed',
      auditHistory: 'Audit of AirLine MRO on 2025-04-17 - Compliant',
      violationRecords: 'None',
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
        REGULATORY AUTHORITY DASHBOARD
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
        <Table sx={{ minWidth: 800 }} aria-label="regulatory authority compliance log table">
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
              <TableCell>Regulatory Authority</TableCell>
              <TableCell>Regulations & Standards</TableCell>
              <TableCell>Certification Data</TableCell>
              <TableCell>Inspection Data</TableCell>
              <TableCell>Audit History</TableCell>
              <TableCell>Violation Records</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {regulatoryData.map((item, index) => (
              <TableRow
                key={`${item.authorityName}-${index}`}
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
                  {item.authorityName}
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
                  {item.regulations}
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
                  {item.certificationData}
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
                  {item.inspectionData}
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
                  {item.auditHistory}
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
                  {item.violationRecords}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RegulatoryAuthorityDashboard;