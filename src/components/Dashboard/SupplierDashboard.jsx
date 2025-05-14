import React, { useState, useEffect } from 'react';
import { useBlockchain } from '../../context/BlockchainContext';
import { Container, Box, Typography, Button } from '@mui/material';
import { toast } from 'react-toastify';
import HomeSection from '../supplier/HomeSection';
import MaterialsSection from '../supplier/MaterialsSection';
import CurrentOrdersSection from '../supplier/CurrentOrdersSection';
import TransactionsSection from '../supplier/TransactionsSection';
import DeliveriesSection from '../supplier/DeliveriesSection';
import Sidebar from '../ReusableComponent/Sidebar';
import Header from '../Header';

const SupplierDashboard = () => {
  const { account, contract, provider, connectWallet, checkVerification, isVerified, role, networkError } = useBlockchain();
  const [activeSection, setActiveSection] = useState('Home');
  const [loading, setLoading] = useState(true);
  const [walletConnecting, setWalletConnecting] = useState(false);

  // Debug context values
  useEffect(() => {
    console.log('BlockchainContext values:', { account, contract, provider, isVerified, role, networkError });
  }, [account, contract, provider, isVerified, role, networkError]);

  const handleConnectWallet = async () => {
    setWalletConnecting(true);
    const success = await connectWallet();
    if (success) {
      await checkVerification('Supplier');
      setLoading(true);
    } else {
      toast.error('Failed to connect wallet. Please ensure MetaMask is on the correct network (chain ID 5777) and Ganache is running.');
    }
    setWalletConnecting(false);
  };

  const handleRetry = async () => {
    setLoading(true);
    await handleConnectWallet();
  };

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;
    const retryInterval = 2000;

    const attemptCheckVerification = async () => {
      if (contract && account) {
        await checkVerification('Supplier');
        setLoading(false);
      } else if (retryCount < maxRetries) {
        console.log(`Contract or account not ready, retrying (${retryCount + 1}/${maxRetries})...`);
        retryCount++;
        setTimeout(attemptCheckVerification, retryInterval);
      } else {
        console.error('Max retries reached. Contract or account not initialized.');
        toast.error('Failed to initialize blockchain connection. Please ensure MetaMask is on the correct network (chain ID 5777) and try again.');
        setLoading(false);
      }
    };

    attemptCheckVerification();
  }, [contract, account, checkVerification]);

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        toast.error('Wallet disconnected. Please reconnect to continue.');
        setLoading(false);
      } else {
        setLoading(true);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  if (networkError && !networkError.includes('pending for role')) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Network Error
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {networkError}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Please ensure MetaMask is connected to chain ID 5777 (Ganache Local, RPC URL: http://127.0.0.1:7545) and Ganache is running.
        </Typography>
        <Button
          variant="contained"
          onClick={handleRetry}
          disabled={walletConnecting}
          sx={{ mt: 2 }}
        >
          {walletConnecting ? 'Connecting...' : 'Retry Connection'}
        </Button>
      </Container>
    );
  }

  if (!account) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Wallet Not Connected
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Please connect your wallet to access the Supplier Dashboard.
        </Typography>
        <Button
          variant="contained"
          onClick={handleConnectWallet}
          disabled={walletConnecting}
          sx={{ mt: 2 }}
        >
          {walletConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      </Container>
    );
  }

  if (!contract) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Blockchain Contract Not Initialized
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Unable to connect to the blockchain contract. Please ensure MetaMask is on the correct network (chain ID 5777) or contact support.
        </Typography>
        <Button
          variant="contained"
          onClick={handleRetry}
          disabled={walletConnecting}
          sx={{ mt: 2 }}
        >
          {walletConnecting ? 'Connecting...' : 'Retry Connection'}
        </Button>
      </Container>
    );
  }

  if (!isVerified) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Your Account is Not Verified
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Your account is not verified as a supplier. Please contact the admin to get verified.
        </Typography>
        {networkError && networkError.includes('pending for role') && (
          <Typography variant="body1" sx={{ mt: 2, color: 'info.main' }}>
            {networkError}
          </Typography>
        )}
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} />
        <Container sx={{ mt: 4, flexGrow: 1, p: 3 }}>
          {(() => {
            switch (activeSection) {
              case 'Home':
                return <HomeSection />;
              case 'Materials':
                return <MaterialsSection />;
              case 'Orders':
                return <CurrentOrdersSection />;
              case 'Transactions':
                return <TransactionsSection />;
              case 'Deliveries':
                return <DeliveriesSection />;
              default:
                return <HomeSection />;
            }
          })()}
        </Container>
      </Box>
    </>
  );
};

export default SupplierDashboard;