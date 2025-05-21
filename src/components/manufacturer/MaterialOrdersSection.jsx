import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { BlockchainContext } from "../../context/BlockchainContext";
import { ethers } from "ethers";
import ManufacturerABI from "../../abis/Manufacturer.json";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Button, TextField, CircularProgress
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";

// Smart contract setup
const CONTRACT_ADDRESS = "0x138cf86356F439E2225A2e8753a13c3921A8185e";
const CONTRACT_ABI = ManufacturerABI.abi;

// Gradient background container
const GradientBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "linear-gradient(to right, #e0eafc, #cfdef3)",
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(8),
}));

export default function MaterialOrdersSection() {
  const { account, connectWallet } = useContext(BlockchainContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [materialsList, setMaterialsList] = useState([]);
  const [orderQuantity, setOrderQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!account) connectWallet();
  }, [account, connectWallet]);

  const searchMaterials = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/manufacturer/search?search=${searchQuery}`
      );
      setMaterialsList(response.data);
    } catch (error) {
      console.error("Error searching materials:", error);
      toast.error(`❌ Search failed: ${error.message}`);
    }
    setLoading(false);
  };

  const placeOrder = async (material) => {
    if (!account) {
      toast.warning("Please connect MetaMask to place an order.");
      connectWallet();
      return;
    }

    if (!material.supplierWallet || !ethers.isAddress(material.supplierWallet)) {
      toast.error("Invalid supplier wallet address.");
      return;
    }

    const quantity = parseInt(orderQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.warning("Enter a valid quantity.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const safeSupplierWallet = ethers.getAddress(material.supplierWallet);
      const ethPricePerKg = material.pricePerKg / 250000;
      const totalPriceEth = quantity * ethPricePerKg;
      const pricePerKgWei = ethers.parseEther(ethPricePerKg.toString());
      const totalPriceWei = ethers.parseEther(totalPriceEth.toString());

      const tx = await contract.placeOrder(
        material.name,
        quantity,
        safeSupplierWallet,
        pricePerKgWei,
        { value: totalPriceWei }
      );
      const receipt = await tx.wait();

      let contractOrderId = null;
      const iface = new ethers.Interface(CONTRACT_ABI);
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed.name === "OrderPlaced") {
            contractOrderId = Number(parsed.args.id.toString());
            break;
          }
        } catch (_) {}
      }

      if (!contractOrderId) {
        toast.error("❌ OrderPlaced event not found!");
        return;
      }

      toast.success(`✅ Order placed! Sent ${totalPriceEth.toFixed(5)} ETH`);

      const payload = {
        materialName: material.name,
        quantity,
        supplier: safeSupplierWallet,
        manufacturer: account,
        totalPrice: quantity * material.pricePerKg,
        contractOrderId,
      };

      const response = await axios.post("http://localhost:5000/api/order/create", payload);
      if (response.status === 201) {
        toast.success(`📦 Order saved! Order ID: ${response.data.order._id}`);
        setOrderQuantity("");
      }
    } catch (error) {
      console.error("❌ Transaction failed:", error);
      let errorMessage = error.message || "Unknown error";
      try {
        const contractInterface = new ethers.Interface(CONTRACT_ABI);
        const decoded = contractInterface.parseError(error.data);
        errorMessage = `Contract error: ${decoded.name}`;
      } catch (_) {}
      toast.error(errorMessage);
    }
  };

  return (
    <GradientBox>
      <Typography variant="h3" sx={{ fontWeight: "bold", textAlign: "center", mb: 2, color: "#1a237e" }}>
        🏭 MANUFACTURER DASHBOARD
      </Typography>

      <Typography variant="h5" sx={{ textAlign: "center", mb: 3, fontWeight: 500, color: "#0d47a1" }}>
        MATERIAL ORDERS
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <TextField
          label="Search Material"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "300px", mr: 2, backgroundColor: "white", borderRadius: 1 }}
        />
        <Button onClick={searchMaterials} variant="contained" sx={{ px: 4, backgroundColor: "#1976d2" }}>
          SEARCH
        </Button>
      </Box>

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress color="primary" />
          <Typography mt={2} color="textSecondary">Searching materials...</Typography>
        </Box>
      ) : materialsList.length > 0 ? (
        <TableContainer component={Paper} sx={{ borderRadius: "16px", boxShadow: 3 }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
              <TableRow>
                {[
                  "Name", "Details", "Quantity", "Price/kg", "Serial",
                  "Batch", "Cert.", "Authority", "Action"
                ].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: "bold", color: "#0d47a1" }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {materialsList.map((material) => (
                <TableRow key={material._id} hover>
                  <TableCell>{material.name}</TableCell>
                  <TableCell>{material.details}</TableCell>
                  <TableCell>{material.quantity} kg</TableCell>
                  <TableCell>₹{material.pricePerKg}</TableCell>
                  <TableCell>{material.serialNumber}</TableCell>
                  <TableCell>{material.batchNumber}</TableCell>
                  <TableCell>{material.certification ? "✅" : "❌"}</TableCell>
                  <TableCell>{material.certifiedAuthority}</TableCell>
                  <TableCell>
                    <TextField
                      label="Qty"
                      type="number"
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(e.target.value)}
                      size="small"
                      sx={{ width: "80px", mr: 1, backgroundColor: "#fff", borderRadius: 1 }}
                    />
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => placeOrder(material)}
                    >
                      Order
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : searched ? (
        <Typography textAlign="center" sx={{ mt: 4 }} color="error">
          ❌ No materials found for "{searchQuery}"
        </Typography>
      ) : (
        <Typography textAlign="center" sx={{ mt: 4, color: "gray" }}>
          Please search to view materials
        </Typography>
      )}
    </GradientBox>
  );
}
