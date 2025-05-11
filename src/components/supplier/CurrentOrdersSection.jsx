import React, { useState, useEffect, useContext } from 'react';
import { BlockchainContext } from '../../context/BlockchainContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const CurrentOrdersSection = ({ account }) => {
  const { contract } = useContext(BlockchainContext);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/order/supplier/${account}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (account) {
      fetchOrders();
    }
  }, [account]);

  const handleSupply = async (order) => {
    try {
      const tx = await contract.createDelivery(
        order.orderId,
        order.materialName,
        order.quantity,
        order.manufacturerAddress,
        { from: account }
      );
      await tx.wait();

      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/order/${order.orderId}`, {
        status: 'supplied',
        transactionId: tx.transactionHash,
      });

      toast.success('Order supplied successfully!');
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error('Failed to supply order.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Current Orders</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Material Name</th>
            <th className="border p-2">Quantity Ordered</th>
            <th className="border p-2">Manufacturer</th>
            <th className="border p-2">Delivery Address</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td className="border p-2">{order.orderId}</td>
              <td className="border p-2">{order.materialName}</td>
              <td className="border p-2">{order.quantity} kg</td>
              <td className="border p-2">{order.manufacturerAddress.slice(0, 6)}...{order.manufacturerAddress.slice(-4)}</td>
              <td className="border p-2">{order.deliveryAddress || 'N/A'}</td>
              <td className="border p-2">{order.status}</td>
              <td className="border p-2">
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleSupply(order)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
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