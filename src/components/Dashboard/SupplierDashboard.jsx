import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../ReusableComponent/Sidebar';
import NewMaterialForm from '../ReusableComponent/NewMaterialForm';
import HomeSection from '../supplier/HomeSection';
import CurrentOrdersSection from '../supplier/CurrentOrdersSection';
import DeliveriesSection from '../supplier/DeliveriesSection';
import TransactionsSection from '../supplier/TransactionsSection';
import MaterialsSection from '../supplier/MaterialsSection';
import { BlockchainContext } from '../../context/BlockchainContext';
import { toast } from 'react-toastify';

const SupplierDashboard = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [showNewMaterialForm, setShowNewMaterialForm] = useState(false);
  const [materials, setMaterials] = useState([]);
  const { account } = useContext(BlockchainContext);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const toggleNewMaterialForm = () => {
    setShowNewMaterialForm(!showNewMaterialForm);
  };

  const fetchMaterials = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/supplier/materials/${account}`);
      if (!res.ok) throw new Error('Failed to fetch materials');
      const data = await res.json();
      setMaterials(data);
    } catch (err) {
      console.error('❌ Error fetching materials:', err.message);
      toast.error('❌ Failed to load materials from database');
    }
  };

  useEffect(() => {
    if (account) fetchMaterials();
  }, [account]);

  const handleMaterialSubmit = () => {
    toast.success('✅ Material added successfully!');
    toggleNewMaterialForm();
    fetchMaterials(); // refresh list from backend
  };

  const menuItems = [
    { key: 'home', label: 'Home' },
    { key: 'currentOrders', label: 'Current Orders' },
    { key: 'materials', label: 'Materials' },
    { key: 'deliveries', label: 'Deliveries' },
    { key: 'transactions', label: 'Transactions' },
  ];

  return (
    <div className="flex min-h-[92vh] bg-gray-100">
      <Sidebar
        role="Supplier"
        menuItems={menuItems}
        onSectionChange={handleSectionChange}
        activeSection={activeSection}
      />

      <div className="flex-1 p-6">
        <div className="flex justify-center items-center mb-6 relative">
          <h1 className="text-4xl font-bold text-gray-700 text-center">SUPPLIER DASHBOARD</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition absolute right-0"
            onClick={toggleNewMaterialForm}
          >
            Add New Material
          </button>
        </div>

        {activeSection === 'home' && <HomeSection materials={materials} />}
        {activeSection === 'currentOrders' && <CurrentOrdersSection />}
        {activeSection === 'materials' && <MaterialsSection materials={materials} />}
        {activeSection === 'deliveries' && <DeliveriesSection />}
        {activeSection === 'transactions' && <TransactionsSection />}

        {showNewMaterialForm && (
          <NewMaterialForm onClose={toggleNewMaterialForm} onSubmit={handleMaterialSubmit} />
        )}
      </div>
    </div>
  );
};

export default SupplierDashboard;
