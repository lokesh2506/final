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
  TextField,
  Fade,
  Backdrop,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";

const PartsProductionSection = () => {
  const { account, contract, provider } = useBlockchain();
  const [parts, setParts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newPart, setNewPart] = useState({ name: "", description: "" });

  const fetchParts = async () => {
    if (contract) {
      try {
        const partData = await contract.getParts();
        const manufacturerParts = partData.filter(
          (part) => part.manufacturer.toLowerCase() === account.toLowerCase()
        );
        setParts(manufacturerParts);
      } catch (error) {
        console.error("Error fetching parts:", error);
        toast.error("Failed to fetch parts");
      }
    }
  };

  const handleCreatePart = async (e) => {
    e.preventDefault();
    if (!contract || !account) {
      toast.error("Please connect your wallet");
      return;
    }
    try {
      const { name, description } = newPart;
      const tx = await contract.createPart(name, description, { from: account });
      await tx.wait();
      toast.success("Part created successfully");
      fetchParts();
      setOpenModal(false);
      setNewPart({ name: "", description: "" });
    } catch (error) {
      console.error("Error creating part:", error);
      toast.error("Failed to create part");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPart((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchParts();
    if (contract && provider) {
      contract.on("PartCreated", fetchParts);
      return () => contract.removeAllListeners();
    }
  }, [contract, provider, account]);

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Parts Production
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
        >
          Add New Part
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Part ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Manufacturer</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {parts.map((part, index) => (
            <TableRow key={index}>
              <TableCell>{part.partId.toString()}</TableCell>
              <TableCell>{part.name}</TableCell>
              <TableCell>{part.description}</TableCell>
              <TableCell>{part.manufacturer}</TableCell>
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
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              width: "90%",
              maxWidth: 600,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Add New Part
            </Typography>
            <form onSubmit={handleCreatePart}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Part Name"
                    name="name"
                    value={newPart.name}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="description"
                    value={newPart.description}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={3}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Create Part
                  </Button>
                  <Button
                    onClick={() => setOpenModal(false)}
                    sx={{ ml: 2 }}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
};

export default PartsProductionSection;