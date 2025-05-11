import React, { useState, useEffect } from "react";
import { useBlockchain} from "../../context/BlockchainContext";
import { Container, Box, Typography } from "@mui/material";
import { toast } from "react-toastify";
import HomeSection from "../supplier/HomeSection";
import MaterialsSection from "../supplier/MaterialsSection";
import CurrentOrdersSection from "../supplier/CurrentOrdersSection";
import TransactionsSection from "../supplier/TransactionsSection";
import DeliveriesSection from "../supplier/DeliveriesSection";
import Sidebar from "../ReusableComponent/Sidebar";
import Header from "../Header";

const SupplierDashboard = () => {
  const { account, contract, provider } = useBlockchain();
  const [activeSection, setActiveSection] = useState("Home");
  const [isCertified, setIsCertified] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkCertification = async () => {
    if (contract && account) {
      try {
        const certified = await contract.isCertifiedSupplier(account);
        setIsCertified(certified);
      } catch (error) {
        console.error("Error checking certification:", error);
        toast.error("Failed to check certification status");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    checkCertification();
    if (contract && provider) {
      contract.on("SupplierCertified", (certifiedAddress) => {
        if (certifiedAddress.toLowerCase() === account.toLowerCase()) {
          setIsCertified(true);
        }
      });
      return () => contract.removeAllListeners();
    }
  }, [contract, provider, account]);

  const renderSection = () => {
    switch (activeSection) {
      case "Home":
        return <HomeSection />;
      case "Materials":
        return <MaterialsSection />;
      case "Orders":
        return <CurrentOrdersSection />;
      case "Transactions":
        return <TransactionsSection />;
      case "Deliveries":
        return <DeliveriesSection />;
      default:
        return <HomeSection />;
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  if (!isCertified) {
    return (
      <>
        <Header />
        <Container sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error">
            Your account is not certified by the admin.
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Please contact the admin to get certified and access the Supplier Dashboard.
          </Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} />
        <Container sx={{ mt: 4, flexGrow: 1, p: 3 }}>
          {renderSection()}
        </Container>
      </Box>
    </>
  );
};

export default SupplierDashboard;