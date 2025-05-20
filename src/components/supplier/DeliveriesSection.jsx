import React, { useState, useEffect, useContext } from 'react';
import { BlockchainContext } from '../../context/BlockchainContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DeliveriesSection = () => {
  const { account } = useContext(BlockchainContext);
  const [deliveries, setDeliveries] = useState([]);

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/supplier/deliveries/${account}`);
      setDeliveries(res.data);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast.error('Failed to load deliveries');
    }
  };

  useEffect(() => {
    if (account) fetchDeliveries();
  }, [account]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Deliveries</h2>
      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Delivery ID</th>
            <th className="border p-2">Material</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Manufacturer</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Tracking No.</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => (
            <tr key={delivery._id}>
              <td className="border p-2">{delivery._id}</td>
              <td className="border p-2">{delivery.materialName}</td>
              <td className="border p-2">{delivery.quantity} kg</td>
              <td className="border p-2">
                {delivery.manufacturer?.slice(0, 6)}...{delivery.manufacturer?.slice(-4)}
              </td>
              <td className="border p-2 capitalize">{delivery.status}</td>
              <td className="border p-2">{delivery.trackingNumber || 'N/A'}</td>
              <td className="border p-2">
                {new Date(delivery.deliveryDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveriesSection;
