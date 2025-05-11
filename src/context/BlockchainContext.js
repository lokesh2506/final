import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import AdminABI from '../abis/Admin.json';
import SupplierABI from '../abis/Supplier.json';
import ManufacturerABI from '../abis/Manufacturer.json';

export const BlockchainContext = createContext();

const contractAddresses = {
  admin: '0x227158c2B31c8AAC52d63bA753e09f2ab67C2412',
  manufacturer: '0xC4be9a727d8d38877c8F1EFB14855A6a75509591',
  supplier: '0xAdfA254854aB2358fddfc84C589B37beb764482B',
  mro: '0xYourMROContractAddressHere',
  airline: '0xYourAirlineContractAddressHere',
  regulatoryAuthority: '0xYourRegulatoryAuthorityAddressHere',
};

export const BlockchainProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contracts, setContracts] = useState({});
  const [provider, setProvider] = useState(null);
  const [role, setRole] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);

        const signer = await provider.getSigner();

        const adminContract = new ethers.Contract(contractAddresses.admin, AdminABI.abi, signer);
        const supplierContract = new ethers.Contract(contractAddresses.supplier, SupplierABI.abi, signer);
        const manufacturerContract = new ethers.Contract(contractAddresses.manufacturer, ManufacturerABI.abi, signer);

        setContracts({
          admin: adminContract,
          supplier: supplierContract,
          manufacturer: manufacturerContract,
        });

        window.ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts[0] || null);
        });

        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };

  const checkVerification = async (role) => {
    if (contracts.admin && account) {
      try {
        const verified = await contracts.admin.isVerified(account, role);
        setIsVerified(verified);
        setRole(role);
      } catch (error) {
        console.error("Error checking verification:", error);
      }
    }
  };

  return (
    <BlockchainContext.Provider
      value={{
        account,
        setAccount,
        contracts,
        provider,
        role,
        isVerified,
        connectWallet,
        checkVerification,
        setRole,
        setIsVerified,
      }}
    >
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