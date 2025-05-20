import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, FormControl, FormLabel,
  RadioGroup, FormControlLabel, Radio, IconButton, Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import SupplierABI from '../../abis/Supplier.json';
import { useBlockchain } from '../../context/BlockchainContext';

const NewMaterialForm = ({ onClose, onSubmit, initialData }) => {
  const { contracts } = useBlockchain();
  const [formData, setFormData] = useState({
    materialName: '',
    materialDetails: '',
    quantity: '',
    serialNumber: '',
    batchNumber: '',
    certification: 'no',
    certifiedAuthority: '',
    pricePerKg: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        materialName: initialData.materialName || '',
        materialDetails: initialData.materialDetails || '',
        quantity: initialData.quantity || '',
        serialNumber: initialData.serialNumber || '',
        batchNumber: initialData.batchNumber || '',
        certification: initialData.certification ? 'yes' : 'no',
        certifiedAuthority: initialData.certifiedAuthority || '',
        pricePerKg: initialData.pricePerKg || '',
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.materialName) newErrors.materialName = 'Name is required';
    if (!formData.materialDetails) newErrors.materialDetails = 'Details required';
    if (!formData.quantity || isNaN(formData.quantity)) newErrors.quantity = 'Valid quantity required';
    if (!formData.serialNumber) newErrors.serialNumber = 'Serial Number required';
    if (!formData.batchNumber) newErrors.batchNumber = 'Batch Number required';
    if (!formData.pricePerKg || isNaN(formData.pricePerKg)) newErrors.pricePerKg = 'Valid price required';
    if (formData.certification === 'yes' && !formData.certifiedAuthority) {
      newErrors.certifiedAuthority = 'Authority required';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const chainId = network.chainId.toString();

      const supplierAddress = SupplierABI.networks?.[chainId]?.address;
      if (!supplierAddress) throw new Error(`Contract not deployed on network ${chainId}`);

      const contract = new ethers.Contract(supplierAddress, SupplierABI.abi, signer);

      const txParams = {
        value: ethers.parseEther("0.001"),
        gasLimit: 500000,
        maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
        maxFeePerGas: ethers.parseUnits("20", "gwei"),
      };

      const materialData = [
        formData.materialName,
        formData.materialDetails,
        parseInt(formData.quantity),
        formData.serialNumber,
        formData.batchNumber,
        formData.certification === 'yes',
        formData.certifiedAuthority || '',
        ethers.parseUnits(formData.pricePerKg.toString(), 0),
      ];

      console.log("📦 Sending TX Debug:", {
        contract: supplierAddress,
        from: await signer.getAddress(),
        chainId,
        params: materialData,
        txOptions: txParams
      });

      // ✅ Trigger smart contract
      const tx = await contract.addMaterial(...materialData, txParams);
      await tx.wait();

      toast.success('✅ Material added to blockchain');

      const supplierWallet = await signer.getAddress();
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/supplier/addMaterial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialName: formData.materialName,
          materialDetails: formData.materialDetails,
          quantity: parseInt(formData.quantity),
          serialNumber: formData.serialNumber,
          batchNumber: formData.batchNumber,
          certification: formData.certification === 'yes',
          certifiedAuthority: formData.certifiedAuthority,
          pricePerKg: parseFloat(formData.pricePerKg),
          supplierWallet
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Backend error');

      toast.success('✅ Material stored in database');
      onSubmit();
      onClose();
    } catch (err) {
      console.error("❌ Material add error:", err);
      toast.error(`❌ Failed: ${err.message}`);
    }
  };

  return (
    <Box sx={{
      position: 'fixed', inset: 0, bgcolor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1300
    }}>
      <Box sx={{
        bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 3,
        maxWidth: 500, width: '100%', position: 'relative'
      }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, color: 'black' }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'black' }}>
          {initialData ? 'Edit Material' : 'Add New Material'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Material Name *" name="materialName" value={formData.materialName}
            onChange={handleChange} fullWidth margin="normal"
            error={!!errors.materialName} helperText={errors.materialName} />

          <TextField label="Material Details *" name="materialDetails" value={formData.materialDetails}
            onChange={handleChange} fullWidth margin="normal"
            error={!!errors.materialDetails} helperText={errors.materialDetails} />

          <TextField label="Quantity (kg) *" name="quantity" type="number" value={formData.quantity}
            onChange={handleChange} fullWidth margin="normal"
            error={!!errors.quantity} helperText={errors.quantity} />

          <TextField label="Serial Number *" name="serialNumber" value={formData.serialNumber}
            onChange={handleChange} fullWidth margin="normal"
            error={!!errors.serialNumber} helperText={errors.serialNumber} />

          <TextField label="Batch Number *" name="batchNumber" value={formData.batchNumber}
            onChange={handleChange} fullWidth margin="normal"
            error={!!errors.batchNumber} helperText={errors.batchNumber} />

          <FormControl fullWidth margin="normal">
            <FormLabel sx={{ color: 'black' }}>Certified</FormLabel>
            <RadioGroup row name="certification" value={formData.certification} onChange={handleChange}>
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          {formData.certification === 'yes' && (
            <TextField label="Certified Authority *" name="certifiedAuthority" value={formData.certifiedAuthority}
              onChange={handleChange} fullWidth margin="normal"
              error={!!errors.certifiedAuthority} helperText={errors.certifiedAuthority} />
          )}

          <TextField label="Price per kg *" name="pricePerKg" type="number" value={formData.pricePerKg}
            onChange={handleChange} fullWidth margin="normal"
            error={!!errors.pricePerKg} helperText={errors.pricePerKg} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={onClose}>Cancel</Button>
            <Button variant="contained" type="submit">Submit</Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default NewMaterialForm;
