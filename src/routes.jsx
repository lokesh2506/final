import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useBlockchain } from './context/BlockchainContext';
import Home from './pages/Home';
import SupplierDashboard from './components/Dashboard/SupplierDashboard';
import ManufacturerDashboard from './components/Dashboard/ManufacturerDashboard';
import AirlineDashboard from './components/Dashboard/AirlineDashboard';
import MRODashboard from './components/Dashboard/MRODashboard';
import RegulatoryAuthorityDashboard from './components/Dashboard/RegulatoryAuthorityDashboard';
import PrivateRoute from '../src/components/PrivateRoute';

const Dashboard = () => {
  const { role } = useBlockchain();
  console.log('Current role in Dashboard:', role);

  if (role === 'Supplier') return <SupplierDashboard />;
  if (role === 'Manufacturer') return <ManufacturerDashboard />;
  if (role === 'Airline') return <AirlineDashboard />;
  if (role === 'MRO') return <MRODashboard />;
  if (role === 'RegulatoryAuthority') return <RegulatoryAuthorityDashboard />;
  return <div>Please select a valid role</div>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/supplier-dashboard"
        element={
          <PrivateRoute>
            <SupplierDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/manufacturer-dashboard"
        element={
          <PrivateRoute>
            <ManufacturerDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/airline-dashboard"
        element={
          <PrivateRoute>
            <AirlineDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/mro-dashboard"
        element={
          <PrivateRoute>
            <MRODashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/regulatory-authority-dashboard"
        element={
          <PrivateRoute>
            <RegulatoryAuthorityDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;