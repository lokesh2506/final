import React, { useEffect, useState, useContext } from 'react';
import { FaBoxOpen, FaShoppingCart, FaDollarSign, FaWeight } from 'react-icons/fa';
import { BlockchainContext } from '../../context/BlockchainContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const HomeSection = () => {
  const { account } = useContext(BlockchainContext);
  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalQuantity: 0,
    totalOrders: 0,
    totalTransactions: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/supplier/stats/${account}`);
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch supplier stats:', err);
        toast.error('Failed to load dashboard stats');
      }
    };

    if (account) fetchStats();
  }, [account]);

  const StatCard = ({ icon: Icon, color, label, value, unit }) => (
    <div className={`relative bg-${color}-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200/50`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{label}</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-gray-900">{(value || 0).toLocaleString()}</p>
            <span className="text-sm text-gray-500">{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="home-section py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StatCard icon={FaBoxOpen} color="blue" label="Total Materials" value={stats.totalMaterials} unit="materials" />
          <StatCard icon={FaWeight} color="indigo" label="Total Quantity" value={stats.totalQuantity} unit="kg" />
          <StatCard icon={FaShoppingCart} color="green" label="Total Orders" value={stats.totalOrders} unit="orders" />
          <StatCard icon={FaDollarSign} color="purple" label="Total Transactions" value={stats.totalTransactions} unit="transactions" />
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
