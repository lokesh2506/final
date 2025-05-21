import React, { useState } from 'react';
import Sidebar from '../ReusableComponent/Sidebar';
import ServiceOrdersSection from '../mro/ServiceOrdersSection';
import RequestPartsSection from '../mro/RequestPartsSection';
import TransactionsSection from '../mro/TransactionsSection';

const MRODashboard = () => {
  const [activeSection, setActiveSection] = useState('Home');

  // Menu items for sidebar
  const menuItems = [
    { key: 'ServiceOrders', label: 'Service Orders' },
    { key: 'RequestParts', label: 'Request Parts' },
    { key: 'Transactions', label: 'Transactions' },
  ];

  // Debug log to verify props
  console.log('MRODashboard passing to Sidebar:', {
    menuItems,
    setActiveSection,
    activeSection,
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        menuItems={menuItems}
        setActiveSection={setActiveSection}
        activeSection={activeSection}
      />
      <div className="flex-1 mt-8 p-6">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          MRO DASHBOARD
        </h1>
        {activeSection === 'ServiceOrders' && (
          <ServiceOrdersSection setActiveSection={setActiveSection} />
        )}

        {activeSection === 'RequestParts' && <RequestPartsSection />}
        {activeSection === 'Transactions' && <TransactionsSection />}
      </div>
    </div>
  );
};

export default MRODashboard;
