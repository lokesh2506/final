import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../ReusableComponent/Sidebar';
import HomeSection from '../manufacturer/HomeSection';
import OrdersSection from '../manufacturer/OrdersSection';
import MaterialInventorySection from '../manufacturer/MaterialInventorySection';
import MaterialOrdersSection from '../manufacturer/MaterialOrdersSection';
import PartsProductionSection from '../manufacturer/PartsProductionSection';
import QualityAssuranceSection from '../manufacturer/QualityAssuranceSection';
import ShipmentManagementSection from '../manufacturer/ShipmentManagementSection';
import TransactionHistorySection from '../manufacturer/TransactionHistorySection';
import { BlockchainContext } from '../../context/BlockchainContext';

const ManufacturerDashboard = () => {
  const [activeSection, setActiveSection] = useState('home');
  const { account } = useContext(BlockchainContext);
  const [dashboardData, setDashboardData] = useState({});

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!account) return;
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/manufacturer/stats/${account}`);
        const data = await res.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      }
    };

    fetchDashboardStats();
  }, [account]);

  const menuItems = [
    { key: 'home', label: 'Home' },
    { key: 'orders', label: 'MRO Orders' },
    { key: 'materialInventory', label: 'Material Inventory' },
    { key: 'materialOrders', label: 'Material Orders' },
    { key: 'partsProduction', label: 'Parts Production' },
    { key: 'qualityAssurance', label: 'Quality Assurance' },
    { key: 'shipmentManagement', label: 'Shipment Management' },
    { key: 'TranscationHistory', label: 'Transaction History' },
  ];

  return (
    <div className="flex min-h-[92vh] bg-gray-100">
      <Sidebar menuItems={menuItems} onSectionChange={handleSectionChange} activeSection={activeSection} />
      <div className="flex-1 p-6">
        <div className="flex justify-center items-center mb-6 relative">
          <h1 className="text-4xl font-bold text-gray-700 text-center">MANUFACTURER DASHBOARD</h1>
        </div>

        {activeSection === 'home' && <HomeSection stats={dashboardData} />}
        {activeSection === 'orders' && <OrdersSection />}
        {activeSection === 'materialInventory' && <MaterialInventorySection />}
        {activeSection === 'materialOrders' && <MaterialOrdersSection />}
        {activeSection === 'partsProduction' && <PartsProductionSection />}
        {activeSection === 'qualityAssurance' && <QualityAssuranceSection />}
        {activeSection === 'shipmentManagement' && <ShipmentManagementSection />}
        {activeSection === 'TranscationHistory' && <TransactionHistorySection />}
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
