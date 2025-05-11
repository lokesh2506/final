import React, { useState, useEffect } from "react";
import { useBlockchain } from "../../context/BlockchainContext";
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import NewMaterialForm from "../ReusableComponent/NewMaterialForm";

const MaterialInventorySection = () => {
  const { account, contract, provider } = useBlockchain();
  const [materials, setMaterials] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    materialId: "",
    name: "",
    materialDetails: "",
    quantity: "",
    serialNumber: "",
    batchNumber: "",
    certified: false,
    certifiedAuthority: "",
    pricePerKg: "",
  });

  const fetchMaterials = async () => {
    if (contract) {
      try {
        const materialData = await contract.getMaterials();
        const manufacturerMaterials = materialData.filter(
          (material) => material.manufacturer.toLowerCase() === account.toLowerCase()
        );
        const response = await axios.get("http://localhost:5000/api/material");
        const backendMaterials = response.data;
        const mergedMaterials = manufacturerMaterials.map((material) => {
          const backendMaterial = backendMaterials.find(
            (bm) => bm.materialId === material.materialId
          );
          return {
            ...material,
            materialDetails: backendMaterial?.materialDetails || "",
            serialNumber: backendMaterial?.serialNumber || "",
            batchNumber: backendMaterial?.batchNumber || "",
            certified: backendMaterial?.certified || false,
            certifiedAuthority: backendMaterial?.certifiedAuthority || "",
            pricePerKg: backendMaterial?.pricePerKg || 0,
          };
        });
        setMaterials(mergedMaterials);
      } catch (error) {
        console.error("Error fetching materials:", error);
        toast.error("Failed to fetch materials");
      }
    }
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    if (!contract || !account) {
      toast.error("Please connect your wallet");
      return;
    }
    try {
      const {
        materialId,
        name,
        materialDetails,
        quantity,
        serialNumber,
        batchNumber,
        certified,
        certifiedAuthority,
        pricePerKg,
      } = newMaterial;
      const manufacturer = account;
      const tx = await contract.addMaterial(
        materialId,
        name,
        parseInt(quantity),
        manufacturer,
        { from: account }
      );
      await tx.wait();
      toast.success("Material added successfully");

      await axios.post("http://localhost:5000/api/material", {
        materialId,
        name,
        materialDetails,
        quantity: parseInt(quantity),
        serialNumber,
        batchNumber,
        certified,
        certifiedAuthority,
        pricePerKg: parseInt(pricePerKg),
        manufacturer,
      });

      fetchMaterials();
      setOpenModal(false);
      setNewMaterial({
        materialId: "",
        name: "",
        materialDetails: "",
        quantity: "",
        serialNumber: "",
        batchNumber: "",
        certified: false,
        certifiedAuthority: "",
        pricePerKg: "",
      });
    } catch (error) {
      console.error("Error adding material:", error);
      toast.error("Failed to add material");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMaterial((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    fetchMaterials();
    if (contract && provider) {
      contract.on("MaterialAdded", fetchMaterials);
      return () => contract.removeAllListeners();
    }
  }, [contract, provider, account]);

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Material Inventory
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
        >
          Add New Material
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Material Name</TableCell>
            <TableCell>Material Details</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Serial Number</TableCell>
            <TableCell>Batch Number</TableCell>
            <TableCell>Price per kg</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {materials.map((material, index) => (
            <TableRow key={index}>
              <TableCell>{material.name}</TableCell>
              <TableCell>{material.materialDetails}</TableCell>
              <TableCell>{material.quantity.toString()} kg</TableCell>
              <TableCell>{material.serialNumber}</TableCell>
              <TableCell>{material.batchNumber}</TableCell>
              <TableCell>${material.pricePerKg}/kg</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openModal}>
          <NewMaterialForm
            newMaterial={newMaterial}
            handleInputChange={handleInputChange}
            handleSubmit={handleAddMaterial}
            handleCancel={() => setOpenModal(false)}
          />
        </Fade>
      </Modal>
    </Container>
  );
};

export default MaterialInventorySection;