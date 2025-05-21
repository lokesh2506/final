import React, { useState, useEffect, useContext } from 'react';
import { BlockchainContext } from '../../context/BlockchainContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DeliveriesSection = () => {
  const { account } = useContext(BlockchainContext);
  const [deliveries, setDeliveries] = useState([]);

  // Generate a random tracking number
  const generateTrackingNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'TRK-';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Format today's date
  const getToday = () => {
    const now = new Date();
    return now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/supplier/deliveries/${account}`);
      const enriched = res.data.map((delivery) => ({
        ...delivery,
        trackingNumber: delivery.trackingNumber || generateTrackingNumber(),
        deliveryDate: delivery.deliveryDate || getToday(),
      }));
      setDeliveries(enriched);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast.error('❌ Failed to load deliveries');
    }
  };

  useEffect(() => {
    if (account) fetchDeliveries();
  }, [account]);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">📦 Deliveries</h2>
      {deliveries.length === 0 ? (
        <p className="text-center text-gray-400">No deliveries found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700 rounded shadow-lg">
            <thead className="bg-gray-800 text-gray-200 uppercase text-sm tracking-wider">
              <tr>
                <th className="px-4 py-3 border border-gray-700">Delivery ID</th>
                <th className="px-4 py-3 border border-gray-700">Material</th>
                <th className="px-4 py-3 border border-gray-700">Quantity</th>
                <th className="px-4 py-3 border border-gray-700">Manufacturer</th>
                <th className="px-4 py-3 border border-gray-700">Status</th>
                <th className="px-4 py-3 border border-gray-700">Tracking No.</th>
                <th className="px-4 py-3 border border-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((d, i) => (
                <tr
                  key={d._id || i}
                  className="hover:bg-gray-800 transition duration-200 text-sm text-gray-100"
                >
                  <td className="px-4 py-3 border border-gray-700 text-blue-400">{d._id.slice(0, 18)}...</td>
                  <td className="px-4 py-3 border border-gray-700">{d.materialName}</td>
                  <td className="px-4 py-3 border border-gray-700">{d.quantity} kg</td>
                  <td className="px-4 py-3 border border-gray-700">
                    {d.manufacturer.slice(0, 6)}...{d.manufacturer.slice(-4)}
                  </td>
                  <td className="px-4 py-3 border border-gray-700 text-green-500 font-semibold">
                    ✅ {d.status}
                  </td>
                  <td className="px-4 py-3 border border-gray-700 font-mono text-yellow-400">
                    {d.trackingNumber}
                  </td>
                  <td className="px-4 py-3 border border-gray-700">{d.deliveryDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeliveriesSection;
