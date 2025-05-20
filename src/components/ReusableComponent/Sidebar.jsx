import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Home as HomeIcon,
  Build as ServiceOrdersIcon,
  Info as ServiceDetailsIcon,
  Inventory as InventoryIcon,
  History as MaintenanceLogsIcon,
  Verified as QualityAssuranceIcon,
  RequestQuote as RequestPartsIcon,
  Receipt as TransactionsIcon,
  LocalShipping as DeliveriesIcon,
  ShoppingCart as OrdersIcon,
  Category as MaterialsIcon,
  Factory as PartsProductionIcon,
  LocalShipping as ShipmentManagementIcon,
} from '@mui/icons-material';
import {
  FaPlane,
  FaWrench,
  FaClock,
  FaTools,
  FaBalanceScale,
  FaHistory,
  FaBuilding,
  FaBook,
  FaSearch,
  FaExclamationTriangle,
  FaFileAlt,
  FaLink,
} from 'react-icons/fa';

const Sidebar = ({ menuItems, setActiveSection, activeSection, onSectionChange }) => {
  console.log('Sidebar received props:', {
    menuItems,
    setActiveSection: typeof setActiveSection,
    onSectionChange: typeof onSectionChange,
    activeSection,
  });

  const iconMap = {
    home: <HomeIcon />,
    Home: <HomeIcon />,
    orders: <OrdersIcon />,
    ServiceOrders: <ServiceOrdersIcon />,
    ServiceDetails: <ServiceDetailsIcon />,
    materialInventory: <InventoryIcon />,
    Inventory: <InventoryIcon />,
    materialOrders: <OrdersIcon />,
    partsProduction: <PartsProductionIcon />,
    qualityAssurance: <QualityAssuranceIcon />,
    QualityAssurance: <QualityAssuranceIcon />,
    shipmentManagement: <ShipmentManagementIcon />,
    TransactionHistory: <TransactionsIcon />,
    TranscationHistory: <TransactionsIcon />,
    Transactions: <TransactionsIcon />,
    RequestParts: <RequestPartsIcon />,
    Materials: <MaterialsIcon />,
    Deliveries: <DeliveriesIcon />,
    MaintenanceLogs: <MaintenanceLogsIcon />,
    AircraftInformation: <FaPlane className="w-6 h-6" />,
    MaintenanceHistory: <FaWrench className="w-6 h-6" />,
    FlightHours: <FaClock className="w-6 h-6" />,
    ServiceRequest: <FaTools className="w-6 h-6" />,
    RegulatoryCompliance: <FaBalanceScale className="w-6 h-6" />,
    EntityCompliance: <FaBuilding className="w-6 h-6" />,
    RegulationsStandards: <FaBook className="w-6 h-6" />,
    InspectionData: <FaSearch className="w-6 h-6" />,
    ViolationRecords: <FaExclamationTriangle className="w-6 h-6" />,
    CertificationData: <FaFileAlt className="w-6 h-6" />,
    AuditHistory: <FaHistory className="w-6 h-6" />,
    BlockchainTransaction: <FaLink className="w-6 h-6" />,
  };

  const handleItemClick = (section) => {
    console.log('handleItemClick called with section:', section, {
      setActiveSection: typeof setActiveSection,
      onSectionChange: typeof onSectionChange,
    });
    const sectionChangeHandler = setActiveSection || onSectionChange;
    if (typeof sectionChangeHandler === 'function') {
      sectionChangeHandler(section);
    } else {
      console.error('No valid section change handler provided:', {
        setActiveSection,
        onSectionChange,
      });
    }
  };

  if (!menuItems || !Array.isArray(menuItems)) {
    console.error('Invalid menuItems:', menuItems);
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#1e2a44',
            color: '#fff',
            borderRight: 'none',
            borderRadius: '0 16px 16px 0',
            marginTop: '7.5vh',
          },
        }}
      >
        <Typography sx={{ p: 2, color: '#fff' }}>
          Error: Invalid menu items
        </Typography>
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#1e2a44',
          color: '#fff',
          borderRight: 'none',
          borderRadius: '0 16px 16px 0',
          marginTop: '7.5vh',
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              selected={activeSection === item.key}
              onClick={() => handleItemClick(item.key)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#fff',
                  color: '#1e2a44',
                  '&:hover': { backgroundColor: '#f5f5f5' },
                },
                '&:hover': {
                  backgroundColor: '#2a3b5e',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: activeSection === item.key ? '#1e2a44' : '#fff',
                }}
              >
                {iconMap[item.key] || <HomeIcon />}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
