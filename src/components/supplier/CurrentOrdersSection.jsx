import React, { useState, useEffect, useContext } from 'react';
import { BlockchainContext } from '../../context/BlockchainContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const CurrentOrdersSection = () => {
  const { account, contract } = useContext(BlockchainContext);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/order/supplier/${account}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load supplier orders');
    }
  };

  useEffect(() => {
    if (account) fetchOrders();
  }, [account]);

  const handleSupply = async (order) => {
    try {
      const tx = await contract.createDelivery(
        order._id,
        order.materialName,
        order.quantity,
        order.manufacturer,
        { from: account }
      );
      await tx.wait();

      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/order/${order._id}`, {
        status: 'supplied',
        transactionId: tx.transactionHash,
      });

      toast.success('✅ Order supplied successfully!');
      fetchOrders();
    } catch (error) {
      console.error('Supply error:', error);
      toast.error('❌ Failed to supply order');
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h2 className="text-2xl font-bold mb-4">Current Orders</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200 text-sm text-left">
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Material</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Manufacturer</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="border p-2">{order._id}</td>
              <td className="border p-2">{order.materialName}</td>
              <td className="border p-2">{order.quantity} kg</td>
              <td className="border p-2">
                {order.manufacturer?.slice(0, 6)}...{order.manufacturer?.slice(-4)}
              </td>
              <td className="border p-2 capitalize">{order.status}</td>
              <td className="border p-2">
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleSupply(order)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    Supply
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CurrentOrdersSection;
