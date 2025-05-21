import React, { useState, useEffect, useContext } from 'react';
import { BlockchainContext } from '../../context/BlockchainContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const SuppliedMaterialInventory = () => {
  const { account } = useContext(BlockchainContext);
  const [deliveries, setDeliveries] = useState([]);

  const getTodayDate = () =>
    new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const fetchDeliveries = async () => {
    try {
      if (!account) return;

      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/delivery/manufacturer/${account}`
      );

      const enriched = res.data.map((delivery) => ({
        ...delivery,
        deliveryDate: delivery.deliveryDate
          ? new Date(delivery.deliveryDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : getTodayDate(),
        certified: '✅ Yes',
      }));

      setDeliveries(enriched);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast.error('❌ Failed to load supplied inventory');
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [account]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-blue-50 py-10 px-4">
      <h2 className="text-center text-4xl font-extrabold mb-10 text-indigo-900 tracking-wide">
        🚚 Supplied Material Inventory
      </h2>

      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Material</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Quantity</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Supplier</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Delivered On</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Certified</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {deliveries.length > 0 ? (
              deliveries.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-indigo-50 transition duration-200 text-slate-700"
                >
                  <td className="px-6 py-3 font-medium">{item.materialName}</td>
                  <td className="px-6 py-3">{item.quantity} kg</td>
                  <td className="px-6 py-3">
                    <span className="text-slate-800 font-mono">
                      {item.supplier?.slice(0, 6)}...{item.supplier?.slice(-4)}
                    </span>
                  </td>
                  <td className="px-6 py-3">{item.deliveryDate}</td>
                  <td className="px-6 py-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                      {item.certified}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-6 text-center text-gray-400 italic">
                  No supplied inventory found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuppliedMaterialInventory;
