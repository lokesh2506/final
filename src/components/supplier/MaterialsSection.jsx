import React, { useState, useEffect, useContext } from 'react';
import { BlockchainContext } from '../../context/BlockchainContext';
import axios from 'axios';
import NewMaterialForm from '../ReusableComponent/NewMaterialForm';
import { toast } from 'react-toastify';

const MaterialsSection = () => {
  const { account } = useContext(BlockchainContext);
  const [materials, setMaterials] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/supplier/materials/${account}`);
      setMaterials(res.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast.error('❌ Failed to load materials');
    }
  };

  useEffect(() => {
    if (account) fetchMaterials();
  }, [account]);

  const handleEdit = (material) => {
    setSelectedMaterial(material);
    setEditOpen(true);
  };

  const handleUpdateMaterial = async (materialData) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/material/${selectedMaterial._id}`, {
        ...materialData,
        supplierWallet: account,
      });
      toast.success('✅ Material updated successfully!');
      setEditOpen(false);
      fetchMaterials();
    } catch (error) {
      console.error(error);
      toast.error('❌ Failed to update material.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/material/${id}`);
      toast.success('🗑️ Material deleted successfully!');
      fetchMaterials();
    } catch (error) {
      console.error(error);
      toast.error('❌ Failed to delete material.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Materials</h2>

      {materials.length === 0 ? (
        <p className="text-gray-500">No materials found. Add or import materials to view them here.</p>
      ) : (
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border p-2">Name</th>
              <th className="border p-2">Details</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Serial #</th>
              <th className="border p-2">Batch #</th>
              <th className="border p-2">Certified</th>
              <th className="border p-2">Authority</th>
              <th className="border p-2">Price/kg</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => (
              <tr key={material._id} className="text-gray-800">
                <td className="border p-2">{material.name}</td>
                <td className="border p-2">{material.details}</td>
                <td className="border p-2">{material.quantity}</td>
                <td className="border p-2">{material.serialNumber}</td>
                <td className="border p-2">{material.batchNumber}</td>
                <td className="border p-2 text-center">{material.certification ? '✅' : '❌'}</td>
                <td className="border p-2">{material.certifiedAuthority || '—'}</td>
                <td className="border p-2">${material.pricePerKg}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(material)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(material._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {editOpen && (
        <NewMaterialForm
          onClose={() => setEditOpen(false)}
          onSubmit={handleUpdateMaterial}
          initialData={selectedMaterial}
        />
      )}
    </div>
  );
};

export default MaterialsSection;
