import React, { useState } from "react";
import { useBlockchain } from "../../context/BlockchainContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";

const Register = () => {
  const { account, contract, setRole } = useBlockchain();
  const [role, setLocalRole] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!account || !contract) {
      toast.error("Please connect your wallet");
      return;
    }
    if (!role) {
      toast.error("Please select a role");
      return;
    }
    try {
      if (role === "Supplier") {
        const tx = await contract.registerSupplier({ from: account });
        await tx.wait();
        await axios.post("http://localhost:5000/api/supplier", { supplierAddress: account });
        toast.success("Supplier registered successfully");
        setRole("Supplier");
        navigate("/supplier-dashboard");
      } else if (role === "Manufacturer") {
        const tx = await contract.registerManufacturer({ from: account });
        await tx.wait();
        await axios.post("http://localhost:5000/api/manufacturer", { manufacturerAddress: account });
        toast.success("Manufacturer registered successfully");
        setRole("Manufacturer");
        navigate("/manufacturer-dashboard");
      }
    } catch (error) {
      console.error("Error registering:", error);
      toast.error("Failed to register. You may already be registered.");
    }
  };

  return (
    <Container sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Role</InputLabel>
          <Select
            value={role}
            onChange={(e) => setLocalRole(e.target.value)}
            label="Select Role"
          >
            <MenuItem value="Supplier">Supplier</MenuItem>
            <MenuItem value="Manufacturer">Manufacturer</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRegister}
          disabled={!role}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default Register;