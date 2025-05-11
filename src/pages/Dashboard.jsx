import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BlockchainContext } from '../context/BlockchainContext';
import Header from '../components/Header';
import SupplierDashboard from '../components/Dashboard/SupplierDashboard';
import ManufacturerDashboard from '../components/Dashboard/ManufacturerDashboard';
import MRODashboard from '../components/Dashboard/MRODashboard';
import AirlineDashboard from '../components/Dashboard/AirlineDashboard';
import RegulatoryAuthorityDashboard from '../components/Dashboard/RegulatoryAuthorityDashboard';

const Dashboard = () => {
  const { account, role } = useContext(BlockchainContext);
  const location = useLocation();
  const navigate = useNavigate();
  const passedRole = location.state?.role || role;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (account && passedRole) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => {
        if (!account || !passedRole) {
          setIsLoading(false);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [account, passedRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!account || !passedRole) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
          <p className="mb-4">Please log in with a verified account to access the dashboard.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (passedRole) {
      case 'Supplier':
        return <SupplierDashboard />;
      case 'Manufacturer':
        return <ManufacturerDashboard />;
      case 'MRO':
        return <MRODashboard />;
      case 'Airline':
        return <AirlineDashboard />;
      case 'Regulatory Authority':
        return <RegulatoryAuthorityDashboard />;
      default:
        return <div className="text-center text-white mt-10 text-xl">Invalid role.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header />
      {passedRole ? (
        renderDashboard()
      ) : (
        <div className="text-center mt-10 text-xl">No role selected.</div>
      )}
    </div>
  );
};

export default Dashboard;