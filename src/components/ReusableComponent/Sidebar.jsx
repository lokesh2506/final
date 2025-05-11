import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Home as HomeIcon,
  Inventory as MaterialsIcon,
  ShoppingCart as OrdersIcon,
  Receipt as TransactionsIcon,
  LocalShipping as DeliveriesIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useBlockchain}  from '../../context/BlockchainContext';
import { toast } from 'react-toastify';

const Sidebar = ({ setActiveSection, activeSection }) => {
  const { setAccount, setRole } = useBlockchain();

  const menuItems = [
    { name: "Home", icon: <HomeIcon />, section: "Home" },
    { name: "Materials", icon: <MaterialsIcon />, section: "Materials" },
    { name: "Orders", icon: <OrdersIcon />, section: "Orders" },
    { name: "Transactions", icon: <TransactionsIcon />, section: "Transactions" },
    { name: "Deliveries", icon: <DeliveriesIcon />, section: "Deliveries" },
    { name: "Logout", icon: <LogoutIcon />, section: "Logout" },
  ];

  const handleItemClick = (section) => {
    if (section === "Logout") {
      setAccount(null);
      setRole(null);
      toast.success('Logged out successfully!');
      window.location.href = '/';
    } else {
      setActiveSection(section);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#1e2a44",
          color: "#fff",
          borderRight: "none",
          borderRadius: "0 16px 16px 0",
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{ p: 2, fontWeight: "bold", color: "#f4c430" }}
      >
        SUPPLIER DASHBOARD
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              selected={activeSection === item.section}
              onClick={() => handleItemClick(item.section)}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#fff",
                  color: "#1e2a44",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                },
                "&:hover": {
                  backgroundColor: "#2a3b5e",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: activeSection === item.section ? "#1e2a44" : "#fff",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;