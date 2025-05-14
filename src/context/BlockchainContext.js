import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import AdminABI from '../abis/Admin.json';
import SupplierABI from '../abis/Supplier.json';
import ManufacturerABI from '../abis/Manufacturer.json';

export const BlockchainContext = createContext();

const getContractAddress = (abi, chainId) => {
  const address = abi.networks[chainId]?.address;
  console.log(`Contract address for chain ID ${chainId} in ABI:`, { abiName: abi.contractName, address });
  if (!address) {
    throw new Error(`No address found for contract ${abi.contractName} on chain ID ${chainId}`);
  }
  return address;
};

const validateAbi = (abi, contractName) => {
  if (!abi || !Array.isArray(abi) || abi.length === 0) {
    console.error(`Invalid ABI for ${contractName}:`, abi);
    throw new Error(`Invalid ABI for ${contractName}. Please ensure the ABI is correctly generated.`);
  }
  console.log(`ABI validated for ${contractName}, length:`, abi.length);
  return abi;
};

const EXPECTED_CHAIN_ID = '5777';
const EXPECTED_RPC_URL = 'http://127.0.0.1:7545';

// Store the last request time to enforce a delay
const requestTimestamps = new Map();

export const BlockchainProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contracts, setContracts] = useState({});
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [role, setRole] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [networkError, setNetworkError] = useState(null);

  const checkRpcAvailability = async (rpcUrl) => {
    try {
      const tempProvider = new ethers.JsonRpcProvider(rpcUrl);
      await tempProvider.getNetwork();
      console.log(`RPC provider at ${rpcUrl} is available`);
      return true;
    } catch (error) {
      console.error(`RPC provider at ${rpcUrl} is unavailable:`, error);
      return false;
    }
  };

  const switchNetwork = async (chainId) => {
    try {
      console.log(`Attempting to switch to chain ID ${chainId}`);
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${parseInt(chainId).toString(16)}` }],
      });
      console.log(`Successfully switched to chain ID ${chainId}`);
      setNetworkError(null);
      return true;
    } catch (error) {
      if (error.code === 4902) {
        try {
          console.log(`Network not found, adding chain ID ${chainId}`);
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${parseInt(chainId).toString(16)}`,
                chainName: 'Ganache Local',
                rpcUrls: [EXPECTED_RPC_URL],
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18,
                },
                blockExplorerUrls: null,
              },
            ],
          });
          console.log(`Successfully added and switched to chain ID ${chainId}`);
          setNetworkError(null);
          return true;
        } catch (addError) {
          console.error('Error adding network:', addError);
          setNetworkError(`Please add the network (chain ID ${chainId}) in MetaMask. RPC URL: ${EXPECTED_RPC_URL}`);
          return false;
        }
      }
      console.error('Error switching network:', error);
      setNetworkError(`Please switch to the correct network (chain ID ${chainId}) in MetaMask. RPC URL: ${EXPECTED_RPC_URL}`);
      return false;
    }
  };

  const initializeBlockchain = async (retryCount = 0, maxRetries = 3) => {
    if (!window.ethereum) {
      console.error('MetaMask not detected');
      setNetworkError('MetaMask not detected. Please install MetaMask.');
      return false;
    }

    const isRpcAvailable = await checkRpcAvailability(EXPECTED_RPC_URL);
    if (!isRpcAvailable) {
      setNetworkError(
        `Cannot connect to the blockchain network. Please ensure Ganache is running on ${EXPECTED_RPC_URL} (chain ID ${EXPECTED_CHAIN_ID}).`
      );
      return false;
    }

    try {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethProvider);

      const accounts = await ethProvider.listAccounts();
      if (accounts.length > 0) {
        console.log('Account detected:', accounts[0].address);
        setAccount(accounts[0].address);
      } else {
        console.log('No accounts detected');
      }

      const network = await ethProvider.getNetwork();
      const chainId = network.chainId.toString();
      console.log('Current chain ID:', chainId);

      if (chainId !== EXPECTED_CHAIN_ID) {
        console.error(`Network mismatch. Expected chain ID ${EXPECTED_CHAIN_ID}, but got ${chainId}`);
        const switched = await switchNetwork(EXPECTED_CHAIN_ID);
        if (!switched) {
          console.log('Network switch failed or was declined');
          if (retryCount < maxRetries) {
            console.log(`Retrying network initialization (${retryCount + 1}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return initializeBlockchain(retryCount + 1, maxRetries);
          }
          return false;
        }
        const newNetwork = await ethProvider.getNetwork();
        const newChainId = newNetwork.chainId.toString();
        console.log('New chain ID after switch:', newChainId);
        if (newChainId !== EXPECTED_CHAIN_ID) return false;
      }

      const adminAddress = getContractAddress(AdminABI, EXPECTED_CHAIN_ID);
      const supplierAddress = getContractAddress(SupplierABI, EXPECTED_CHAIN_ID);
      const manufacturerAddress = getContractAddress(ManufacturerABI, EXPECTED_CHAIN_ID);

      console.log('Contract addresses:', { adminAddress, supplierAddress, manufacturerAddress });

      const missingContracts = [];
      if (!adminAddress) missingContracts.push('Admin');
      if (!supplierAddress) missingContracts.push('Supplier');
      if (!manufacturerAddress) missingContracts.push('Manufacturer');

      if (missingContracts.length > 0) {
        console.error(`Contracts not deployed on network ${EXPECTED_CHAIN_ID}:`, missingContracts);
        setNetworkError(
          `Contracts not deployed on network (chain ID ${EXPECTED_CHAIN_ID}) for: ${missingContracts.join(', ')}. Please redeploy the contracts.`
        );
        return false;
      }

      const adminAbi = validateAbi(AdminABI.abi, 'Admin');
      const supplierAbi = validateAbi(SupplierABI.abi, 'Supplier');
      const manufacturerAbi = validateAbi(ManufacturerABI.abi, 'Manufacturer');

      const signer = await ethProvider.getSigner();
      const signerAddress = await signer.getAddress();
      console.log('Signer address:', signerAddress);

      let adminContract, supplierContract, manufacturerContract;
      try {
        adminContract = new ethers.Contract(adminAddress, adminAbi, signer);
        supplierContract = new ethers.Contract(supplierAddress, supplierAbi, signer);
        manufacturerContract = new ethers.Contract(manufacturerAddress, manufacturerAbi, signer);
      } catch (error) {
        console.error('Error initializing contracts:', error);
        setNetworkError(`Failed to initialize contracts: ${error.message}`);
        return false;
      }

      const adminContractAddress = await adminContract.getAddress().catch(err => {
        console.error('Error getting Admin contract address:', err);
        return undefined;
      });
      const supplierContractAddress = await supplierContract.getAddress().catch(err => {
        console.error('Error getting Supplier contract address:', err);
        return undefined;
      });
      const manufacturerContractAddress = await manufacturerContract.getAddress().catch(err => {
        console.error('Error getting Manufacturer contract address:', err);
        return undefined;
      });

      setContracts({
        admin: adminContract,
        supplier: supplierContract,
        manufacturer: manufacturerContract,
      });

      console.log('Contracts initialized:', {
        admin: adminContractAddress,
        supplier: supplierContractAddress,
        manufacturer: manufacturerContractAddress,
      });

      setContract(supplierContract);
      console.log('Default contract set to Supplier:', supplierContractAddress);

      return true;
    } catch (error) {
      console.error('Error initializing blockchain:', error);
      setNetworkError(`Failed to initialize blockchain: ${error.message}`);
      return false;
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      console.error('MetaMask not detected');
      setNetworkError('MetaMask not detected. Please install MetaMask.');
      return false;
    }

    try {
      console.log('Requesting wallet connection');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Wallet connected, accounts:', accounts);
      return await initializeBlockchain();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setNetworkError(`Failed to connect wallet: ${error.message}`);
      return false;
    }
  };

  const checkVerification = async (role) => {
    if (contracts.admin && account) {
      try {
        console.log(`Checking verification for role ${role} and account ${account}`);
        const adminAddress = await contracts.admin.getAddress();
        console.log('Admin contract address:', adminAddress);

        const methodExists = contracts.admin.interface.getFunction('isVerified');
        console.log('isVerified method in ABI:', methodExists);

        // Standardize role to match contract (uppercase first letter)
        const standardizedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
        const verified = await contracts.admin.isVerified(account, standardizedRole);
        console.log('Verification result:', verified);

        // If not verified, check if we can request verification
        if (!verified) {
          console.log(`Account ${account} is not verified for role ${standardizedRole}. Checking if request is possible...`);
          try {
            const signer = await provider.getSigner();
            const adminContractWithSigner = contracts.admin.connect(signer);

            // Check the current status in entityRoles
            const entityRoleStatus = await adminContractWithSigner.entityRoles(account, standardizedRole);
            const statusNumber = Number(entityRoleStatus);
            console.log(`Entity role status for ${account} with role ${standardizedRole}: ${statusNumber} (0=Pending, 1=Approved, 2=Rejected)`);

            if (statusNumber === 0) {
              console.log(`A pending request already exists for ${account} with role ${standardizedRole}. Skipping new request.`);
              setNetworkError(`A verification request is already pending for role ${standardizedRole}. Please wait for admin approval.`);
            } else if (statusNumber === 1) {
              console.log(`Account ${account} is already approved for role ${standardizedRole}. Updating verification status.`);
              setIsVerified(true);
            } else {
              // Status is either uninitialized (default 0 but not pending) or rejected (2)
              // Add a delay to avoid spam filter issues
              const requestKey = `${account}-${standardizedRole}`;
              const lastRequestTime = requestTimestamps.get(requestKey) || 0;
              const currentTime = Date.now();
              const minInterval = 5000; // 5 seconds delay between requests

              if (currentTime - lastRequestTime < minInterval) {
                console.log(`Waiting to avoid spam filter. Time since last request: ${currentTime - lastRequestTime}ms`);
                await new Promise(resolve => setTimeout(resolve, minInterval - (currentTime - lastRequestTime)));
              }

              console.log(`Requesting verification for ${account} with role ${standardizedRole}...`);
              const tx = await adminContractWithSigner.requestVerification(standardizedRole);
              await tx.wait();
              console.log(`Verification requested for ${account} with role ${standardizedRole}`);
              requestTimestamps.set(requestKey, Date.now());
              setNetworkError(`Verification request submitted for role ${standardizedRole}. Please wait for admin approval.`);
            }
          } catch (requestError) {
            console.error('Error requesting verification:', requestError);
            let errorMessage = requestError.message;
            if (requestError.data && requestError.data.message) {
              errorMessage = requestError.data.message;
            } else if (requestError.reason) {
              errorMessage = requestError.reason;
            }
            setNetworkError(`Failed to request verification: ${errorMessage}`);
          }
        } else {
          console.log(`Account ${account} is already verified for role ${standardizedRole}.`);
        }

        setIsVerified(verified);
        setRole(standardizedRole);

        if (standardizedRole === 'Supplier') {
          setContract(contracts.supplier);
          console.log('Contract set to Supplier:', await contracts.supplier.getAddress());
        } else if (standardizedRole === 'Manufacturer') {
          setContract(contracts.manufacturer);
          console.log('Contract set to Manufacturer:', await contracts.manufacturer.getAddress());
        } else if (standardizedRole === 'Admin') {
          setContract(contracts.admin);
          console.log('Contract set to Admin:', await contracts.admin.getAddress());
        }
      } catch (error) {
        console.error('Error checking verification:', error);
        setNetworkError(`Failed to check verification: ${error.message}. Please ensure the Admin contract is correctly deployed and the isVerified method is functional.`);
      }
    } else {
      console.log('Cannot check verification: admin contract or account not available');
      setNetworkError('Admin contract or account not available. Please connect wallet and ensure contracts are initialized.');
    }
  };

  useEffect(() => {
    console.log('Initializing blockchain on mount');
    initializeBlockchain();

    const handleAccountsChanged = async (accounts) => {
      console.log('Accounts changed:', accounts);
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        await initializeBlockchain();
      } else {
        setAccount(null);
        setContracts({});
        setContract(null);
        setIsVerified(false);
        setRole(null);
        setNetworkError(null);
      }
    };

    const handleChainChanged = async () => {
      console.log('Chain changed, reinitializing');
      setAccount(null);
      setContracts({});
      setContract(null);
      setIsVerified(false);
      setRole(null);
      setNetworkError(null);
      await initializeBlockchain();
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

  return (
    <BlockchainContext.Provider
      value={{
        account,
        setAccount,
        contracts,
        contract,
        provider,
        role,
        isVerified,
        connectWallet,
        checkVerification,
        setRole,
        setIsVerified,
        setIsLoggedIn,
        networkError,
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