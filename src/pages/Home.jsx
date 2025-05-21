import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlockchainContext } from '../context/BlockchainContext';
import { Select, MenuItem, Button, FormControl, InputLabel, Box, Modal } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';
import { toast } from 'react-toastify';

const roles = [
  'Supplier',
  'Manufacturer',
  'MRO'
];

const Home = () => {
  const { account, connectWallet, setRole } = useContext(BlockchainContext);
  const [showLogin, setShowLogin] = useState(false);
  const [role, setSelectedRole] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const handleRoleChange = (e) => setSelectedRole(e.target.value);

  const checkVerificationStatus = async (walletAddress, role, redirectOnApproval = true) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/verification/requests`);
      const request = response.data.find(
        (req) => req.walletAddress.toLowerCase() === walletAddress.toLowerCase() && req.role === role
      );
      if (request?.status === 'approved' && redirectOnApproval) {
        setRole(role);
        setShowVerificationModal(false);
        setShowLogin(false);
        toast.success(`Verification approved for ${role}. Redirecting to dashboard...`);
        navigate('/dashboard', { state: { role } });
        return true;
      } else if (request?.status === 'rejected') {
        toast.error('Verification rejected by admin.');
        setShowVerificationModal(false);
        return false;
      } else if (request?.status === 'pending') {
        setShowVerificationModal(true);
        return false;
      }
      return false;
    } catch (error) {
      console.error("Error checking verification status:", error);
      toast.error(`Failed to check verification status: ${error.message}`);
      return false;
    }
  };

  const handleLogin = async () => {
    if (!account) {
      toast.warn("Please connect your wallet before logging in.");
      return;
    }
    if (!role) {
      toast.warn("Please select a role before logging in.");
      return;
    }

    const isApproved = await checkVerificationStatus(account, role);
    if (isApproved) return;

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/verification/request`, {
        walletAddress: account,
        role: role,
      });

      if (response.status === 201) {
        toast.info("Verification request submitted. Awaiting admin approval...");
        setShowVerificationModal(true);
      } else if (response.status === 400) {
        toast.warn("Verification request already exists for this wallet and role.");
        setShowVerificationModal(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(`Failed to login: ${error.message}`);
    }
  };

  useEffect(() => {
    if (showVerificationModal && account && role) {
      intervalRef.current = setInterval(() => {
        checkVerificationStatus(account, role);
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [showVerificationModal, account, role]);

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/assets/home.jpg')` }}
    >
      <div className="relative w-full h-64 overflow-hidden">
        <button
          onClick={() => setShowLogin(true)}
          className="absolute top-4 right-4 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-600 transition duration-300"
        >
          Login
        </button>
      </div>

      {!showLogin && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="backdrop-blur-md bg-gray-700/50 rounded-xl px-6 py-4">
            <div className="flex gap-[0.05em] sm:gap-[0.1em] text-5xl sm:text-7xl font-extrabold text-yellow-400 tracking-widest font-[sans-serif]">
              {"AIR WORKS".split("").map((char, idx) => (
                <span
                  key={idx}
                  className="opacity-0 animate-popIn"
                  style={{
                    animationDelay: `${idx * 0.25}s`,
                    display: char === " " ? "inline-block" : undefined,
                    width: char === " " ? "0.5em" : undefined,
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {showLogin && (
        <div
          className="fixed inset-0 bg-neutral-900/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 sm:px-6"
          onClick={() => setShowLogin(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-neutral-900 text-white border border-neutral-700 rounded-2xl shadow-2xl p-6 sm:p-8 transition-all duration-300 animate-fadeIn"
          >
            <button
              className="absolute top-4 right-4 text-yellow-400 hover:text-red-500 transition"
              onClick={() => setShowLogin(false)}
            >
              ✕
            </button>

            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Welcome to <span className="text-yellow-400">Air Works</span>
              </h2>
              <p className="text-sm text-neutral-400 mt-2">Please connect and select your role</p>
            </div>

            <button
              onClick={connectWallet}
              className={`w-full py-3 mb-4 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold rounded-xl hover:from-orange-600 hover:to-yellow-500 transition duration-300 ${account ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={!!account}
            >
              {account ? (
                <span className="flex items-center justify-center relative">
                  <span>Connect MetaMask</span>
                  <span className='p-1 py-0.5 bg-white rounded-full absolute right-2'>
                    <CheckIcon sx={{ color: 'green' }} />
                  </span>
                </span>
              ) : (
                "Connect MetaMask"
              )}
            </button>

            <div className="mb-4 relative">
              <FormControl fullWidth className="mb-4">
                <InputLabel sx={{ color: 'white' }}>Select Role</InputLabel>
                <Select
                  value={role}
                  onChange={handleRoleChange}
                  label="Select Role"
                  className="bg-neutral-800 rounded"
                  sx={{
                    color: 'white',
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: '#9ca3af',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#facc15',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#facc15',
                    },
                    '.MuiSvgIcon-root': {
                      fill: 'white !important',
                    },
                  }}
                >
                  <MenuItem value="">Select Role</MenuItem>
                  {roles.map((r) => (
                    <MenuItem key={r} value={r}>{r}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <button
              onClick={() => handleLogin()}
              className="w-full py-3 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-600 transition duration-300"
            >
              Login
            </button>
          </div>
        </div>
      )}

      <Modal open={showVerificationModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'white',
          p: 4,
          borderRadius: 2,
        }}>
          <h2 className="text-xl font-bold text-black">Wait for Verification</h2>
          <p className="text-black">Your request has been sent to the admin for verification.</p>
        </Box>
      </Modal>
    </div>
  );
};

export default Home;