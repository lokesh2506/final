import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import AdminABI from '../abis/Admin.json';

const BlockchainContext = createContext();

export const BlockchainProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contracts, setContracts] = useState({});
  const [provider, setProvider] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [role, setRole] = useState(null);
  const [networkError, setNetworkError] = useState('');

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setNetworkError('MetaMask not detected. Please install MetaMask.');
        return false;
      }

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      const network = await browserProvider.getNetwork();
      if (network.chainId !== 5777n) {
        throw new Error('Please switch MetaMask to the Ganache network (chain ID 5777).');
      }

      const accounts = await browserProvider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);

      const adminContractAddress = AdminABI.networks['5777']?.address;
      if (!adminContractAddress) {
        setNetworkError('Admin contract not deployed on Ganache.');
        return false;
      }

      const adminContract = new ethers.Contract(adminContractAddress, AdminABI.abi, browserProvider);
      setContracts((prev) => ({ ...prev, admin: adminContract }));

      setNetworkError('');
      toast.success('Wallet connected successfully!');
      return true;
    } catch (error) {
      console.error('Wallet connection error:', error);
      setNetworkError('Failed to connect wallet: ' + error.message);
      return false;
    }
  };

  const checkVerification = async (roleToCheck) => {
    if (!contracts.admin || !account) return;

    try {
      const verified = await contracts.admin.isVerified(account, roleToCheck);
      setIsVerified(verified);
      setRole(roleToCheck);
    } catch (error) {
      setNetworkError('Failed to check verification: ' + error.message);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null);
      });
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  const value = {
    account,
    contracts,
    provider,
    connectWallet,
    checkVerification,
    isVerified,
    role,
    networkError,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};
