import React, { useState, useEffect, useContext } from 'react';
import { BlockchainContext } from '../../context/BlockchainContext';
import axios from 'axios';
import NewMaterialForm from './NewMaterialForm';
import { toast } from 'react-toastify';

const MaterialsSection = ({ account }) => {
  const { contract } = useContext(BlockchainContext);
  const [materials, setMaterials] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const fetchMaterials = async () => {
    try {
      const materialData = await contract.getMaterials();
      const filteredMaterials = materialData.filter(
        (material) => material.supplier.toLowerCase() === account.toLowerCase()
      );

      const materialDetailsPromises = filteredMaterials.map(async (material) => {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/material/${material.materialId.toString()}`
        );
        return { ...material, ...response.data };
      });

      const materialsWithDetails = await Promise.all(materialDetailsPromises);
      setMaterials(materialsWithDetails);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  useEffect(() => {
    if (contract && account) {
      fetchMaterials();
    }
  }, [contract, account]);

  const handleEdit = (material) => {
    setSelectedMaterial(material);
    setEditOpen(true);
  };

  const handleUpdateMaterial = async (materialData) => {
    try {
      const { materialName, materialDetails, quantity, serialNumber, batchNumber, certification, certifiedAuthority, pricePerKg } = materialData;
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/material/${selectedMaterial.materialId}`, {
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

      toast.success('Material updated successfully!');
      setEditOpen(false);
      fetchMaterials();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update material.');
    }
  };

  const handleDelete = async (materialId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/material/${materialId}`);
      toast.success('Material deleted successfully!');
      fetchMaterials();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete material.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Materials</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Material Name</th>
            <th className="border p-2">Material Details</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Serial Number</th>
            <th className="border p-2">Batch Number</th>
            <th className="border p-2">Certification</th>
            <th className="border p-2">Certified Authority</th>
            <th className="border p-2">Price per kg</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr key={material.materialId.toString()}>
              <td className="border p-2">{material.materialName}</td>
              <td className="border p-2">{material.materialDetails}</td>
              <td className="border p-2">{material.quantity} kg</td>
              <td className="border p-2">{material.serialNumber}</td>
              <td className="border p-2">{material.batchNumber}</td>
              <td className="border p-2">{material.certification ? '✅ Certified' : '❌ Not Cert.'}</td>
              <td className="border p-2">{material.certifiedAuthority || '—'}</td>
              <td className="border p-2">${material.pricePerKg}/kg</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(material)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(material.materialId)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <NewMaterialForm
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        handleSubmit={handleUpdateMaterial}
        initialData={selectedMaterial}
      />
    </div>
  );
};

export default MaterialsSection;