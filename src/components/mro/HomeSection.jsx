import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, IconButton } from '@mui/material';
import { FaCogs, FaBoxOpen, FaCheckCircle, FaFileInvoice } from 'react-icons/fa';

const HomeSection = () => {
  const [metrics, setMetrics] = useState({
    totalOngoingOrders: 0,
    totalAvailableParts: 0,
    totalCompletedOrders: 0,
    totalTransactions: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/metrics');
        if (!response.ok) throw new Error('Failed to fetch metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        console.error('Error fetching metrics:', err);
      }
    };
    fetchMetrics();
  }, []);

  const metricsData = [
    {
      metric: 'Total Ongoing Orders',
      value: metrics.totalOngoingOrders,
      unit: 'orders',
      icon: <FaCogs className="w-6 h-6 text-blue-600" />,
      bgColor: '#e3f2fd',
      iconBgColor: '#bbdefb',
    },
    {
      metric: 'Total Available Parts',
      value: metrics.totalAvailableParts,
      unit: 'parts',
      icon: <FaBoxOpen className="w-6 h-6 text-purple-600" />,
      bgColor: '#f3e5f5',
      iconBgColor: '#e1bee7',
    },
    {
      metric: 'Total Completed Orders',
      value: metrics.totalCompletedOrders,
      unit: 'orders',
      icon: <FaCheckCircle className="w-6 h-6 text-green-600" />,
      bgColor: '#e8f5e9',
      iconBgColor: '#c8e6c9',
    },
    {
      metric: 'Total Transactions',
      value: metrics.totalTransactions,
      unit: 'transactions',
      icon: <FaFileInvoice className="w-6 h-6 text-orange-600" />,
      bgColor: '#fff3e0',
      iconBgColor: '#ffcc80',
    },
  ];

  return (
    <Box sx={{ py: 8, px: { xs: 2, sm: 4 } }}>

      <Grid container spacing={3} justifyContent="center">
        {metricsData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                bgcolor: item.bgColor,
                borderRadius: '16px',
                boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)',
                '&:hover': {
                  boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease-in-out',
                },
                border: '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
                <Box
                  sx={{
                    bgcolor: item.iconBgColor,
                    borderRadius: '50%',
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'grey.800', mb: 1 }}>
                    {item.metric}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'extrabold', color: 'grey.900' }}>
                      {item.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.500' }}>
                      {item.unit}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomeSection;