import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { BlockchainContext } from "../../context/BlockchainContext";
import { ethers } from "ethers";
import ManufacturerABI from "../../abis/Manufacturer.json";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  TextField,
} from "@mui/material";

const CONTRACT_ADDRESS = "0x138cf86356F439E2225A2e8753a13c3921A8185e";
const CONTRACT_ABI = ManufacturerABI.abi;

export default function MaterialOrdersSection() {
  const { account, connectWallet } = useContext(BlockchainContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [materialsList, setMaterialsList] = useState([]);
  const [orderQuantity, setOrderQuantity] = useState("");

  useEffect(() => {
    if (!account) connectWallet();
  }, [account, connectWallet]);

  const searchMaterials = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/manufacturer/search?search=${searchQuery}`
      );
      console.log("API Response:", response.data);
      setMaterialsList(response.data);
    } catch (error) {
      console.error("Error searching materials:", error);
      alert(`Failed to search materials: ${error.message}`);
    }
  };

  const placeOrder = async (material) => {
    if (!account) {
      alert("Please connect MetaMask to place an order.");
      connectWallet();
      return;
    }

    if (!material.supplierWallet || !ethers.isAddress(material.supplierWallet)) {
      alert("Invalid supplier wallet address.");
      return;
    }

    const quantity = parseInt(orderQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      alert("Enter a valid quantity.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const safeSupplierWallet = ethers.getAddress(material.supplierWallet);
      const ethPricePerKg = material.pricePerKg / 250000;
      const pricePerKgWei = ethers.parseEther(ethPricePerKg.toString());
      const totalPriceInEth = quantity * ethPricePerKg;
      const totalPriceWei = ethers.parseEther(totalPriceInEth.toString());

      // Optional registration check
      const isRegistered = await contract.isManufacturer(account);
      if (!isRegistered) {
        const txRegister = await contract.registerManufacturer(account, { gasLimit: 300000 });
        await txRegister.wait();
      }

      // Optional: check for a required part
      const partId = 1;
      const part = await contract.getPart(partId);
      if (part.id.toString() === "0") {
        throw new Error("Part does not exist. Please create the part first.");
      }

      const gasEstimate = await contract.placeOrder.estimateGas(
        material.name,
        quantity,
        safeSupplierWallet,
        pricePerKgWei,
        { value: totalPriceWei }
      );

      const tx = await contract.placeOrder(
        material.name,
        quantity,
        safeSupplierWallet,
        pricePerKgWei,
        { value: totalPriceWei, gasLimit: gasEstimate }
      );

      await tx.wait();
      alert(`Order placed! ${totalPriceInEth} ETH sent to ${safeSupplierWallet}`);

      const payload = {
        materialId: material._id || `material_${material.name}_${Date.now()}`,
        quantity,
        manufacturerWallet: account,
        supplierWallet: safeSupplierWallet,
        totalPrice: quantity * material.pricePerKg,
      };

      const response = await axios.post("http://localhost:5000/api/order/create", payload);
      if (response.status === 201) {
        alert("Order recorded in database!");
        setOrderQuantity("");
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      let errorMessage = error.message || "Unknown error occurred";
      try {
        const contractInterface = new ethers.Interface(CONTRACT_ABI);
        const decodedError = contractInterface.parseError(error.data);
        errorMessage = `Contract error: ${decodedError.name}`;
      } catch (_) {}
      alert(errorMessage);
    }
  };

  return (
    <Box sx={{ py: 8, px: { xs: 2, sm: 4 } }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", mb: 4 }}>
        MATERIAL ORDERS
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <TextField
          label="Search Material"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "300px", mr: 2 }}
        />
        <Button onClick={searchMaterials} variant="contained" sx={{ px: 4 }}>
          Search
        </Button>
      </Box>

      {materialsList.length > 0 ? (
        <TableContainer component={Paper} sx={{ borderRadius: "16px" }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                {[
                  "Name",
                  "Details",
                  "Quantity",
                  "Price/kg",
                  "Serial",
                  "Batch",
                  "Cert.",
                  "Authority",
                  "Action",
                ].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: "bold" }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {materialsList.map((material, index) => (
                <TableRow key={material._id}>
                  <TableCell>{material.name}</TableCell>
                  <TableCell>{material.details}</TableCell>
                  <TableCell>{material.quantity} kg</TableCell>
                  <TableCell>₹{material.pricePerKg}</TableCell>
                  <TableCell>{material.serialNumber}</TableCell>
                  <TableCell>{material.batchNumber}</TableCell>
                  <TableCell>{material.certification ? "Yes" : "No"}</TableCell>
                  <TableCell>{material.certifiedAuthority}</TableCell>
                  <TableCell>
                    <TextField
                      label="Qty (kg)"
                      type="number"
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(e.target.value)}
                      sx={{ width: "90px", mr: 1 }}
                    />
                    <Button
                      variant="contained"
                      color="success"
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
      ) : (
        <Typography textAlign="center" sx={{ mt: 4 }}>
          No materials found.
        </Typography>
      )}
    </Box>
  );
}
