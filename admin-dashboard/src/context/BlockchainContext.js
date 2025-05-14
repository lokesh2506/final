import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import AdminABI from '../abis/Admin.json';

// Debug: Log React instance
console.log('React instance in BlockchainContext.js:', React);

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
      console.log('Attempting to connect wallet...');
      console.log('window.ethereum:', window.ethereum);
      if (!window.ethereum) {
        console.log('MetaMask not detected.');
        setNetworkError('MetaMask not detected. Please install MetaMask.');
        return false;
      }

      console.log('MetaMask detected, requesting accounts...');
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      const network = await provider.getNetwork();
      console.log('Connected network chain ID:', network.chainId.toString());
      if (network.chainId !== 5777n) {
        throw new Error('Please switch MetaMask to the Ganache network (chain ID 5777).');
      }

      const accounts = await provider.send('eth_requestAccounts', []);
      console.log('Connected accounts:', accounts);
      setAccount(accounts[0]);
      console.log('Account state after setAccount:', accounts[0]);

      // Attempt to initialize the Admin contract
      const adminContractAddress = AdminABI.networks['5777']?.address;
      console.log('Admin contract address from AdminABI:', adminContractAddress);
      if (!adminContractAddress) {
        setNetworkError(
          'Admin contract not deployed on Ganache (network 5777). Please deploy the contract using Truffle.'
        );
        return false;
      }

      try {
        const adminContract = new ethers.Contract(adminContractAddress, AdminABI.abi, provider);
        console.log('Admin contract initialized:', adminContract);

        // Test the contract by calling a simple function (e.g., getOwner) to ensure it's valid
        const owner = await adminContract.getOwner();
        console.log('Admin contract owner (test call):', owner);

        setContracts((prev) => ({ ...prev, admin: adminContract }));
        console.log('Contracts state after setContracts:', { admin: adminContract });

        setNetworkError('');
        toast.success('Wallet connected successfully!');
        return true;
      } catch (contractError) {
        console.error('Failed to initialize Admin contract:', contractError);
        setNetworkError(
          `Failed to initialize Admin contract: ${contractError.message}. Ensure the contract address and ABI are correct.`
        );
        return false;
      }
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

      if (!verified) {
        const status = await contracts.admin.entityRoles(account, roleToCheck);
        if (Number(status) === 0) {
          setNetworkError(`A verification request is already pending for role ${roleToCheck}. Please wait for admin approval.`);
        }
      }
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