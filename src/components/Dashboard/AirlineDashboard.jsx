
import React, { useState } from 'react';
import Sidebar from '../ReusableComponent/Sidebar';
import HomeSection from '../airlinedashboard/HomeSection';
import AircraftInformationSection from '../airlinedashboard/AircraftInformationSection';
import MaintenanceHistorySection from '../airlinedashboard/MaintenanceHistorySection';
import FlightHoursSection from '../airlinedashboard/FlightHoursSection';
import ServiceRequestSection from '../airlinedashboard/ServiceRequestSection';
import RegulatoryComplianceSection from '../airlinedashboard/RegulatoryComplianceSection';
import TransactionHistorySection from '../airlinedashboard/TransactionHistorySection';

const AirlineDashboard = () => {
  const [activeSection, setActiveSection] = useState('Home');

  // Menu items for sidebar
  const menuItems = [
    { key: 'Home', label: 'Home' },
    { key: 'AircraftInformation', label: 'Aircraft Information' },
    { key: 'MaintenanceHistory', label: 'Maintenance History' },
    { key: 'FlightHours', label: 'Flight Hours' },
    { key: 'ServiceRequest', label: 'Service Request' },
    { key: 'RegulatoryCompliance', label: 'Regulatory Compliance' },
    { key: 'TransactionHistory', label: 'Transaction History' },
  ];

  // Debug log to verify props
  console.log('AirlineDashboard passing to Sidebar:', {
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
          AIRLINE DASHBOARD
        </h1>
        {activeSection === 'Home' && <HomeSection />}
        {activeSection === 'AircraftInformation' && <AircraftInformationSection />}
        {activeSection === 'MaintenanceHistory' && <MaintenanceHistorySection />}
        {activeSection === 'FlightHours' && <FlightHoursSection />}
        {activeSection === 'ServiceRequest' && <ServiceRequestSection />}
        {activeSection === 'RegulatoryCompliance' && <RegulatoryComplianceSection />}
        {activeSection === 'TransactionHistory' && <TransactionHistorySection />}
      </div>
    </div>
  );
};

export default AirlineDashboard;
