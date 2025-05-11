import React, { useState, useContext, useEffect } from 'react';
import { BlockchainContext } from '../../context/BlockchainContext';
import NewMaterialForm from './NewMaterialForm';
import { toast } from 'react-toastify';
import axios from 'axios';

const HomeSection = ({ account }) => {
  const { contract } = useContext(BlockchainContext);
  const [open, setOpen] = useState(false);
  const [metrics, setMetrics] = useState({
    totalMaterials: 0,
    totalOrders: 0,
    totalTransactions: 0,
  });

  const fetchMetrics = async () => {
    try {
      const materialsResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/material/supplier/${account}`
      );
      const ordersResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/order/supplier/${account}`
      );
      const transactions = await contract.getTransactions();
      const filteredTxs = transactions.filter(
        (tx) =>
          tx.sender.toLowerCase() === account.toLowerCase() ||
          tx.receiver.toLowerCase() === account.toLowerCase()
      );

      setMetrics({
        totalMaterials: materialsResponse.data.length,
        totalOrders: ordersResponse.data.length,
        totalTransactions: filteredTxs.length,
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  useEffect(() => {
    if (account && contract) {
      fetchMetrics();
    }
  }, [account, contract]);

  const handleAddMaterial = async (materialData) => {
    try {
      const { materialName, materialDetails, quantity, serialNumber, batchNumber, certification, certifiedAuthority, pricePerKg } = materialData;
      const tx = await contract.addMaterial(
        materialName,
        quantity,
        pricePerKg,
        certification === 'yes',
        { from: account }
      );
      await tx.wait();

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/material`, {
        materialId: tx.logs[0].args.materialId.toString(),
        materialName,
        materialDetails,
        quantity,
        serialNumber,
        batchNumber,
        certification: certification === 'yes',
        certifiedAuthority: certification === 'yes' ? certifiedAuthority : '',
        pricePerKg,
        supplierAddress: account,
      });

      toast.success('Material added successfully!');
      setOpen(false);
      fetchMetrics();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add material.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Supplier Home</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="text-lg font-semibold">Total Materials</h3>
          <p>{metrics.totalMaterials}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p>{metrics.totalOrders}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="text-lg font-semibold">Total Transactions</h3>
          <p>{metrics.totalTransactions}</p>
        </div>
      </div>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add New Material
      </button>
      <NewMaterialForm
        open={open}
        handleClose={() => setOpen(false)}
        handleSubmit={handleAddMaterial}
      />
    </div>
  );
};

export default HomeSection;