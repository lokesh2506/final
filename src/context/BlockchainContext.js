import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';

// ✅ Import ABIs correctly
import AdminABI from '../abis/Admin.json';
import SupplierABI from '../abis/Supplier.json';
import ManufacturerABI from '../abis/Manufacturer.json';
import MROABI from '../abis/MRO.json';
import AirlineABI from '../abis/Airline.json';
import RegulatoryABI from '../abis/RegulatoryAuthority.json';

export const BlockchainContext = createContext();

export const BlockchainProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contracts, setContracts] = useState({});
  const [provider, setProvider] = useState(null);
  const [role, setRole] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);

        const signer = await web3Provider.getSigner();
        const network = await web3Provider.getNetwork();
        const chainId = parseInt(network.chainId.toString());

        const addresses = {
          admin: AdminABI.networks?.[chainId]?.address,
          supplier: SupplierABI.networks?.[chainId]?.address,
          manufacturer: ManufacturerABI.networks?.[chainId]?.address,
          mro: MROABI.networks?.[chainId]?.address,
          airline: AirlineABI.networks?.[chainId]?.address,
          regulatory: RegulatoryABI.networks?.[chainId]?.address,
        };

        // Abort if any contract is missing
        if (Object.values(addresses).some(addr => !addr)) {
          console.error("❌ One or more contract addresses not found for network:", chainId);
          return;
        }

        const instances = {
          admin: new ethers.Contract(addresses.admin, AdminABI.abi, signer),
          supplier: new ethers.Contract(addresses.supplier, SupplierABI.abi, signer),
          manufacturer: new ethers.Contract(addresses.manufacturer, ManufacturerABI.abi, signer),
          mro: new ethers.Contract(addresses.mro, MROABI.abi, signer),
          airline: new ethers.Contract(addresses.airline, AirlineABI.abi, signer),
          regulatory: new ethers.Contract(addresses.regulatory, RegulatoryABI.abi, signer),
        };

        setContracts(instances);

        // Listen for wallet/account changes
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
      alert("MetaMask not found! Please install MetaMask.");
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
        isLoggedIn,
        connectWallet,
        checkVerification,
        setRole,
        setIsVerified,
        setIsLoggedIn,
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
