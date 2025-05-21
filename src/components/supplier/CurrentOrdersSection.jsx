import React, { useState, useEffect, useContext } from 'react';
import { BlockchainContext } from '../../context/BlockchainContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import SupplierABI from '../../abis/Supplier.json';

const SUPPLIER_ABI = SupplierABI.abi;

const CurrentOrdersSection = () => {
  const { account, contracts } = useContext(BlockchainContext);
  const [orders, setOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [activeTab, setActiveTab] = useState('current');
  const [latestTx, setLatestTx] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/supplier/orders/${account}`);
      const data = res.data;

      const currentOrders = data.filter((o) => o.status === 'pending');
      const history = data.filter((o) => o.status !== 'pending');

      const enriched = await Promise.all(
        currentOrders.map(async (order) => {
          if (order.contractOrderId && contracts.supplier) {
            try {
              const contractOrder = await contracts.supplier.orders(order.contractOrderId);
              const totalPriceEth = ethers.formatEther(contractOrder.totalPrice.toString());
              return { ...order, totalPriceEth };
            } catch {
              return { ...order, totalPriceEth: 'N/A' };
            }
          }
          return { ...order, totalPriceEth: 'N/A' };
        })
      );

      setOrders(enriched);
      setHistoryOrders(history);
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to fetch orders');
    }
  };



  useEffect(() => {
    if (account) fetchOrders();
  }, [account]);

  const handleSupply = async (order) => {
    try {
      if (!order.contractOrderId) return toast.error("❗ Missing contractOrderId");

      let quantityToSupply = parseInt(order.quantity);
      if (quantityToSupply === 1000) quantityToSupply = 10;
      else if (quantityToSupply === 10) quantityToSupply = 100;

      setLoadingId(order._id);

      const tx = await contracts.supplier.createDelivery(
        order.contractOrderId,
        order.materialName,
        quantityToSupply,
        order.manufacturer
      );
      const receipt = await tx.wait();
      setLatestTx(receipt.hash);

      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/order/${order._id}`, {
        status: 'supplied',
        transactionId: receipt.hash,
      });

      toast.success(`✅ Supplied! Tx: ${receipt.hash.slice(0, 10)}...`);
      fetchOrders();
    } catch (error) {
      let message = error.message || 'Failed to supply';
      toast.error(`❌ Supply Error: ${message}`);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg p-4 shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Supplier Orders</h2>

      {latestTx && (
        <div className="text-center mb-2 text-green-500">
          ✅ Last Tx: <a href={`https://mumbai.polygonscan.com/tx/${latestTx}`} target="_blank" rel="noopener noreferrer" className="underline text-blue-400">{latestTx.slice(0, 10)}...</a>
        </div>
      )}

      <div className="flex justify-center mb-4">
        <button onClick={() => setActiveTab('current')} className={`px-4 py-2 rounded-l-lg ${activeTab === 'current' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
          Current Orders
        </button>
        <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-r-lg ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
          Order History
        </button>
      </div>

      {(activeTab === 'current' ? orders : historyOrders).length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No {activeTab} orders.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-sm text-left">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Material</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Manufacturer</th>
              <th className="border p-2">Status</th>
              {activeTab === 'current' && <th className="border p-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {(activeTab === 'current' ? orders : historyOrders).map((order) => (
              <tr key={order._id} className="text-sm">
                <td className="border p-2">{order._id.slice(-6)}</td>
                <td className="border p-2">{order.materialName}</td>
                <td className="border p-2">{order.quantity} kg</td>
                <td className="border p-2">{order.manufacturer.slice(0, 6)}...{order.manufacturer.slice(-4)}</td>
                <td className="border p-2 capitalize font-semibold text-yellow-600">{order.status}</td>
                {activeTab === 'current' && (
                  <td className="border p-2">
                    <button
                      onClick={() => handleSupply(order)}
                      disabled={loadingId === order._id}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:opacity-60"
                    >
                      {loadingId === order._id ? 'Supplying...' : 'Supply'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CurrentOrdersSection;