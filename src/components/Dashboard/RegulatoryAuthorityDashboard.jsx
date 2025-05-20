import React, { useState } from 'react';
import Sidebar from '../ReusableComponent/Sidebar';
import HomeSection from '../regulatoryauthority/HomeSection';
import EntityComplianceSection from '../regulatoryauthority/EntityComplianceSection';
import RegulationsStandardsSection from '../regulatoryauthority/RegulationsStandardsSection';
import InspectionDataSection from '../regulatoryauthority/InspectionDataSection';
import ViolationRecordsSection from '../regulatoryauthority/ViolationRecordsSection';
import CertificationDataSection from '../regulatoryauthority/CertificationDataSection';
import AuditHistorySection from '../regulatoryauthority/AuditHistorySection';
import BlockchainTransactionSection from '../regulatoryauthority/BlockchainTransactionSection';

const RegulatoryAuthorityDashboard = () => {
  const [activeSection, setActiveSection] = useState('Home');

  const menuItems = [
    { key: 'Home', label: 'Home' },
    { key: 'EntityCompliance', label: 'Entity Compliance' },
    { key: 'RegulationsStandards', label: 'Regulations & Standards' },
    { key: 'InspectionData', label: 'Inspection Data' },
    { key: 'ViolationRecords', label: 'Violation Records' },
    { key: 'CertificationData', label: 'Certification Data' },
    { key: 'AuditHistory', label: 'Audit History' },
    { key: 'BlockchainTransaction', label: 'Blockchain Transactions' },
  ];

  console.log('RegulatoryAuthorityDashboard passing to Sidebar:', {
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
          REGULATORY AUTHORITY DASHBOARD
        </h1>
        {activeSection === 'Home' && <HomeSection />}
        {activeSection === 'EntityCompliance' && <EntityComplianceSection />}
        {activeSection === 'RegulationsStandards' && <RegulationsStandardsSection />}
        {activeSection === 'InspectionData' && <InspectionDataSection />}
        {activeSection === 'ViolationRecords' && <ViolationRecordsSection />}
        {activeSection === 'CertificationData' && <CertificationDataSection />}
        {activeSection === 'AuditHistory' && <AuditHistorySection />}
        {activeSection === 'BlockchainTransaction' && <BlockchainTransactionSection />}
      </div>
    </div>
  );
};

export default RegulatoryAuthorityDashboard;