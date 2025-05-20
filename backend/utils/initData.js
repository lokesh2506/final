const Compliance = require('../models/Compliance');
const Regulation = require('../models/Regulation');
const Inspection = require('../models/Inspection');
const Violation = require('../models/Violation');
const Certification = require('../models/Certification');
const Audit = require('../models/Audit');
const BlockchainTransaction = require('../models/BlockchainTransaction');
const Metric = require('../models/Metric');

const initData = async () => {
  try {
    await Compliance.deleteMany({});
    await Regulation.deleteMany({});
    await Inspection.deleteMany({});
    await Violation.deleteMany({});
    await Certification.deleteMany({});
    await Audit.deleteMany({});
    await BlockchainTransaction.deleteMany({});
    await Metric.deleteMany({});

    await Compliance.insertMany([
      { entityId: 'ENT001', entityType: 'Airline', complianceStatus: 'Compliant', certificationStatus: 'Certified', lastInspectionDate: '2025-03-15' },
      { entityId: 'ENT002', entityType: 'MRO', complianceStatus: 'Non-Compliant', certificationStatus: 'Pending Certification', lastInspectionDate: '2025-03-20' },
    ]);

    await Regulation.insertMany([
      { regulationId: 'REG001', title: 'Aircraft Safety', description: 'Defines safety measures for aircraft operation', status: 'Active', lastUpdate: '2025-02-01' },
      { regulationId: 'REG002', title: 'Maintenance Standards', description: 'Establishes standards for maintenance operations', status: 'Active', lastUpdate: '2025-03-01' },
    ]);

    await Inspection.insertMany([
      { inspectionId: 'INS001', entity: 'Airline AL123', date: '2025-03-10', outcome: 'Compliant', nextInspectionDate: '2025-09-10' },
      { inspectionId: 'INS002', entity: 'MRO AeroCraft', date: '2025-03-12', outcome: 'Non-Compliant', nextInspectionDate: '2025-04-01' },
    ]);

    await Violation.insertMany([
      { violationId: 'VIOL001', entity: 'Airline AL123', type: 'Safety', description: 'Failed to conduct engine checks', dateReported: '2025-03-10' },
      { violationId: 'VIOL002', entity: 'MRO AeroCraft', type: 'Documentation', description: 'Missing certification for parts', dateReported: '2025-03-12' },
    ]);

    await Certification.insertMany([
      { certificationId: 'CERT001', type: 'Aircraft Certification', entity: 'Airline AL123', date: '2025-01-01', expiryDate: '2026-01-01' },
      { certificationId: 'CERT002', type: 'Parts Certification', entity: 'MRO AeroCraft', date: '2025-02-01', expiryDate: '2026-02-01' },
    ]);

    await Audit.insertMany([
      { auditId: 'AUD001', entity: 'Airline AL123', date: '2025-03-01', outcome: 'Pass', notes: 'No major issues found' },
      { auditId: 'AUD002', entity: 'MRO AeroCraft', date: '2025-03-05', outcome: 'Fail', notes: 'Non-compliance with parts records' },
    ]);

    await BlockchainTransaction.insertMany([
      { transactionId: 'TXN0x123ABC', date: '2025-03-10', entity: 'Airline AL123', type: 'Certification Issued', notes: 'Airworthiness Certification' },
      { transactionId: 'TXN0x123DEF', date: '2025-03-12', entity: 'MRO AeroCraft', type: 'Inspection Report', notes: 'Passed safety inspection' },
      { transactionId: 'TXN0xAL123A', date: '2025-04-01', entity: 'AeroCraft MRO', type: 'Maintenance', notes: 'Engine Overhaul Completed' },
      { transactionId: 'TXN0xAL123B', date: '2025-04-02', entity: 'AeroCraft Airlines', type: 'Flight Operation', notes: 'Flight No. AL123 Completed' },
    ]);

    await Metric.insertMany([
      { metric: 'Total Entities Monitored', value: '150', unit: 'entities' },
      { metric: 'Total Inspections Conducted', value: '320', unit: 'inspections' },
      { metric: 'Total Certifications Issued', value: '450', unit: 'certifications' },
      { metric: 'Violation Records', value: '25', unit: 'violations' },
      { metric: 'Upcoming Audits', value: '10', unit: 'audits' },
    ]);

    console.log('Initial data loaded successfully');
  } catch (err) {
    console.error('Error initializing data:', err);
  }
};

module.exports = initData;