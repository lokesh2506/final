import React, { useContext, useState } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Header = () => {
  const { account, setAccount, setRole, setIsLoggedIn } = useContext(BlockchainContext);
  const navigate = useNavigate();
  const [showWalletAddress, setShowWalletAddress] = useState(false);

  const handleLogout = () => {
    setAccount(null);
    setRole('');
    setIsLoggedIn(false);
    navigate('/');
  };

  const toggleWalletVisibility = () => {
    setShowWalletAddress(!showWalletAddress);
  };

  const formatWalletAddress = (address) => {
    if (!address) return '...';
    return showWalletAddress ? address : `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-neutral-900 text-yellow-400 shadow-md">
      <h1 className="text-2xl font-bold">AIR WORKS</h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center bg-neutral-700 text-yellow-400 px-3 py-2 rounded-lg">
          <span className="text-sm font-medium mr-2">Wallet:</span>
          <span className="text-sm font-mono">{formatWalletAddress(account)}</span>
          <button
            onClick={toggleWalletVisibility}
            className="ml-2 text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            {showWalletAddress ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;