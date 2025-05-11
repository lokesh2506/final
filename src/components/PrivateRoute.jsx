import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { BlockchainContext } from '../context/BlockchainContext';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, isCertified, role } = useContext(BlockchainContext);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (role && role !== 'Admin' && !isCertified) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: 'white', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
        <h2>Waiting for Certification</h2>
        <p>Your role ({role}) is awaiting certification by the Admin. Please wait...</p>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;