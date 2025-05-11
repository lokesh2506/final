import React, { useState } from 'react';
import { Modal, Box, TextField, Button, MenuItem } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const NewMaterialForm = ({ open, handleClose, handleSubmit, initialData = {} }) => {
  const [materialData, setMaterialData] = useState({
    materialName: initialData.materialName || '',
    materialDetails: initialData.materialDetails || '',
    quantity: initialData.quantity || '',
    serialNumber: initialData.serialNumber || '',
    batchNumber: initialData.batchNumber || '',
    certification: initialData.certification ? 'yes' : 'no',
    certifiedAuthority: initialData.certifiedAuthority || '',
    pricePerKg: initialData.pricePerKg || '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!materialData.materialName) newErrors.materialName = 'Material Name is required';
    if (!materialData.quantity || materialData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (!materialData.serialNumber) newErrors.serialNumber = 'Serial Number is required';
    if (!materialData.batchNumber) newErrors.batchNumber = 'Batch Number is required';
    if (!materialData.pricePerKg || materialData.pricePerKg <= 0) newErrors.pricePerKg = 'Price must be greater than 0';
    if (materialData.certification === 'yes' && !materialData.certifiedAuthority) {
      newErrors.certifiedAuthority = 'Certified Authority is required if certification is yes';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'materialName' || name === 'certifiedAuthority' || name === 'serialNumber' || name === 'batchNumber') {
      if (/^[a-zA-Z0-9\s-]*$/.test(value)) {
        setMaterialData({ ...materialData, [name]: value });
      }
    } else if (name === 'quantity' || name === 'pricePerKg') {
      if (/^\d*\.?\d*$/.test(value)) {
        setMaterialData({ ...materialData, [name]: value });
      }
    } else {
      setMaterialData({ ...materialData, [name]: value });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    handleSubmit(materialData);
    setMaterialData({
      materialName: '',
      materialDetails: '',
      quantity: '',
      serialNumber: '',
      batchNumber: '',
      certification: 'no',
      certifiedAuthority: '',
      pricePerKg: '',
    });
    setErrors({});
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <h2 className="text-xl font-bold mb-4">{initialData.materialId ? 'Edit Material' : 'Add New Material'}</h2>
        <form onSubmit={onSubmit}>
          <TextField
            label="Material Name"
            name="materialName"
            value={materialData.materialName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.materialName}
            helperText={errors.materialName}
          />
          <TextField
            label="Material Details"
            name="materialDetails"
            value={materialData.materialDetails}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            label="Quantity (kg)"
            name="quantity"
            type="number"
            value={materialData.quantity}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.quantity}
            helperText={errors.quantity}
          />
          <TextField
            label="Serial Number"
            name="serialNumber"
            value={materialData.serialNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.serialNumber}
            helperText={errors.serialNumber}
          />
          <TextField
            label="Batch Number"
            name="batchNumber"
            value={materialData.batchNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.batchNumber}
            helperText={errors.batchNumber}
          />
          <TextField
            select
            label="Certification"
            name="certification"
            value={materialData.certification}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </TextField>
          {materialData.certification === 'yes' && (
            <TextField
              label="Certified Authority"
              name="certifiedAuthority"
              value={materialData.certifiedAuthority}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.certifiedAuthority}
              helperText={errors.certifiedAuthority}
            />
          )}
          <TextField
            label="Price per kg ($)"
            name="pricePerKg"
            type="number"
            value={materialData.pricePerKg}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.pricePerKg}
            helperText={errors.pricePerKg}
          />
          <div className="flex justify-end mt-4">
            <Button onClick={handleClose} className="mr-2">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {initialData.materialId ? 'Update Material' : 'Add Material'}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default NewMaterialForm;