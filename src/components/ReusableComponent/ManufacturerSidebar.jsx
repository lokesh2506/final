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
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  Build as PartsIcon,
  Verified as QualityIcon,
  LocalShipping as ShippingIcon,
  History as TransactionIcon,
} from "@mui/icons-material";

const ManufacturerSidebar = ({ setActiveSection, activeSection }) => {
  const menuItems = [
    { name: "Home", icon: <HomeIcon />, section: "Home" },
    { name: "Material Inventory", icon: <InventoryIcon />, section: "Material Inventory" },
    { name: "Material Orders", icon: <OrdersIcon />, section: "Material Orders" },
    { name: "Orders", icon: <OrdersIcon />, section: "Orders" },
    { name: "Parts Production", icon: <PartsIcon />, section: "Parts Production" },
    { name: "Quality Assurance", icon: <QualityIcon />, section: "Quality Assurance" },
    { name: "Shipment Management", icon: <ShippingIcon />, section: "Shipment Management" },
    { name: "Transaction History", icon: <TransactionIcon />, section: "Transaction History" },
  ];

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
        MANUFACTURER DASHBOARD
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              selected={activeSection === item.section}
              onClick={() => setActiveSection(item.section)}
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

export default ManufacturerSidebar;