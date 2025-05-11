import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const NewMaterialForm = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    details: '',
    quantity: '',
    serialNumber: '',
    batchNumber: '',
    certification: 'no',
    certifiedAuthority: '',
    pricePerKg: '',
  });

  const [errors, setErrors] = useState({
    name: false,
    details: false,
    quantity: false,
    serialNumber: false,
    batchNumber: false,
    certifiedAuthority: false,
    pricePerKg: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        details: initialData.details || '',
        quantity: initialData.quantity || '',
        serialNumber: initialData.serialNumber || '',
        batchNumber: initialData.batchNumber || '',
        certification: initialData.certification || 'no',
        certifiedAuthority: initialData.certifiedAuthority || '',
        pricePerKg: initialData.pricePerKg || '',
      });
    }
  }, [initialData]);

  // Validation functions for restricted characters
  const restrictNameAndAuthority = (value) => {
    return value.replace(/[^a-zA-Z\s]/g, '');
  };

  const restrictMaterialDetails = (value) => {
    return value.replace(/[^a-zA-Z0-9\s.,-]/g, '');
  };

  const restrictSerialAndBatchNumber = (value) => {
    return value.replace(/[^a-zA-Z0-9-]/g, '');
  };

  const restrictNumbersOnly = (value) => {
    return value.replace(/[^0-9]/g, ''); // Updated to allow only numbers
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === 'name' || name === 'certifiedAuthority') {
      newValue = restrictNameAndAuthority(value);
    } else if (name === 'details') {
      newValue = restrictMaterialDetails(value);
    } else if (name === 'serialNumber' || name === 'batchNumber') {
      newValue = restrictSerialAndBatchNumber(value);
    } else if (name === 'quantity' || name === 'pricePerKg') {
      newValue = restrictNumbersOnly(value);
    }

    setFormData({
      ...formData,
      [name]: name === 'certification' ? value : newValue,
    });

    // Clear error if the field is filled after correction
    if (newValue) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const handleClear = () => {
    setFormData({
      name: initialData?.name || '',
      details: initialData?.details || '',
      quantity: initialData?.quantity || '',
      serialNumber: initialData?.serialNumber || '',
      batchNumber: initialData?.batchNumber || '',
      certification: initialData?.certification || 'no',
      certifiedAuthority: initialData?.certifiedAuthority || '',
      pricePerKg: initialData?.pricePerKg || '',
    });
    setErrors({
      name: false,
      details: false,
      quantity: false,
      serialNumber: false,
      batchNumber: false,
      certifiedAuthority: false,
      pricePerKg: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      name: !formData.name,
      details: !formData.details,
      quantity: !formData.quantity,
      serialNumber: !formData.serialNumber,
      batchNumber: !formData.batchNumber,
      certifiedAuthority: formData.certification === 'yes' && !formData.certifiedAuthority,
      pricePerKg: !formData.pricePerKg,
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error)) {
      return; // Stop submission if there are errors
    }

    onSubmit(formData);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1300,
      }}
    >
      <Box
        sx={{
          bgcolor: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: '100%',
          maxWidth: 500,
          position: 'relative',
        }}
      >
        {/* Close Button at Top Right */}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8, color: 'black' }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', mb: 3, color: 'black' }}
        >
          {initialData ? 'Edit Material' : 'Add New Material'}
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Material Name */}
          <TextField
            label="Material Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={errors.name}
            sx={{
              '& .MuiInputBase-input': { color: 'black' },
              '& .MuiInputLabel-root': { color: 'black' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '& fieldset': {
                  borderWidth: errors.name ? 2 : 1,
                  borderColor: errors.name ? 'red' : 'gray',
                },
                '&:hover fieldset': {
                  borderWidth: errors.name ? 2 : 1,
                  borderColor: errors.name ? 'red' : 'gray',
                },
                '&.Mui-focused fieldset': {
                  borderWidth: errors.name ? 2 : 1,
                  borderColor: errors.name ? 'red' : 'blue',
                },
              },
            }}
          />

          {/* Material Details */}
          <TextField
            label="Material Details *"
            name="details"
            value={formData.details}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={errors.details}
            sx={{
              '& .MuiInputBase-input': { color: 'black' },
              '& .MuiInputLabel-root': { color: 'black' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '& fieldset': {
                  borderWidth: errors.details ? 2 : 1,
                  borderColor: errors.details ? 'red' : 'gray',
                },
                '&:hover fieldset': {
                  borderWidth: errors.details ? 2 : 1,
                  borderColor: errors.details ? 'red' : 'gray',
                },
                '&.Mui-focused fieldset': {
                  borderWidth: errors.details ? 2 : 1,
                  borderColor: errors.details ? 'red' : 'blue',
                },
              },
            }}
          />

          {/* Quantity */}
          <TextField
            label="Quantity *"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={errors.quantity}
            sx={{
              '& .MuiInputBase-input': { color: 'black' },
              '& .MuiInputLabel-root': { color: 'black' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '& fieldset': {
                  borderWidth: errors.quantity ? 2 : 1,
                  borderColor: errors.quantity ? 'red' : 'gray',
                },
                '&:hover fieldset': {
                  borderWidth: errors.quantity ? 2 : 1,
                  borderColor: errors.quantity ? 'red' : 'gray',
                },
                '&.Mui-focused fieldset': {
                  borderWidth: errors.quantity ? 2 : 1,
                  borderColor: errors.quantity ? 'red' : 'blue',
                },
              },
            }}
          />

          {/* Serial Number */}
          <TextField
            label="Serial Number *"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={errors.serialNumber}
            sx={{
              '& .MuiInputBase-input': { color: 'black' },
              '& .MuiInputLabel-root': { color: 'black' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '& fieldset': {
                  borderWidth: errors.serialNumber ? 2 : 1,
                  borderColor: errors.serialNumber ? 'red' : 'gray',
                },
                '&:hover fieldset': {
                  borderWidth: errors.serialNumber ? 2 : 1,
                  borderColor: errors.serialNumber ? 'red' : 'gray',
                },
                '&.Mui-focused fieldset': {
                  borderWidth: errors.serialNumber ? 2 : 1,
                  borderColor: errors.serialNumber ? 'red' : 'blue',
                },
              },
            }}
          />

          {/* Batch Number */}
          <TextField
            label="Batch Number *"
            name="batchNumber"
            value={formData.batchNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={errors.batchNumber}
            sx={{
              '& .MuiInputBase-input': { color: 'black' },
              '& .MuiInputLabel-root': { color: 'black' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '& fieldset': {
                  borderWidth: errors.batchNumber ? 2 : 1,
                  borderColor: errors.batchNumber ? 'red' : 'gray',
                },
                '&:hover fieldset': {
                  borderWidth: errors.batchNumber ? 2 : 1,
                  borderColor: errors.batchNumber ? 'red' : 'gray',
                },
                '&.Mui-focused fieldset': {
                  borderWidth: errors.batchNumber ? 2 : 1,
                  borderColor: errors.batchNumber ? 'red' : 'blue',
                },
              },
            }}
          />

          {/* Certification Radio Buttons */}
          <FormControl component="fieldset" sx={{ mt: 2, mb: 1 }}>
            <FormLabel
              component="legend"
              sx={{ color: 'black', fontSize: '1rem' }}
            >
              Certified
            </FormLabel>
            <RadioGroup
              row
              name="certification"
              value={formData.certification}
              onChange={handleChange}
            >
              <FormControlLabel
                value="yes"
                control={<Radio />}
                label="Yes"
                sx={{ color: 'black' }}
              />
              <FormControlLabel
                value="no"
                control={<Radio />}
                label="No"
                sx={{ color: 'black' }}
              />
            </RadioGroup>
          </FormControl>

          {/* Certified Authority (only if certification is "yes") */}
          {formData.certification === 'yes' && (
            <TextField
              label="Certified Authority *"
              name="certifiedAuthority"
              value={formData.certifiedAuthority}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={errors.certifiedAuthority}
              sx={{
                '& .MuiInputBase-input': { color: 'black' },
                '& .MuiInputLabel-root': { color: 'black' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '& fieldset': {
                    borderWidth: errors.certifiedAuthority ? 2 : 1,
                    borderColor: errors.certifiedAuthority ? 'red' : 'gray',
                  },
                  '&:hover fieldset': {
                    borderWidth: errors.certifiedAuthority ? 2 : 1,
                    borderColor: errors.certifiedAuthority ? 'red' : 'gray',
                  },
                  '&.Mui-focused fieldset': {
                    borderWidth: errors.certifiedAuthority ? 2 : 1,
                    borderColor: errors.certifiedAuthority ? 'red' : 'blue',
                  },
                },
              }}
            />
          )}

          {/* Price per kg */}
          <TextField
            label="Price per kg *"
            name="pricePerKg"
            value={formData.pricePerKg}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={errors.pricePerKg}
            sx={{
              '& .MuiInputBase-input': { color: 'black' },
              '& .MuiInputLabel-root': { color: 'black' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '& fieldset': {
                  borderWidth: errors.pricePerKg ? 2 : 1,
                  borderColor: errors.pricePerKg ? 'red' : 'gray',
                },
                '&:hover fieldset': {
                  borderWidth: errors.pricePerKg ? 2 : 1,
                  borderColor: errors.pricePerKg ? 'red' : 'gray',
                },
                '&.Mui-focused fieldset': {
                  borderWidth: errors.pricePerKg ? 2 : 1,
                  borderColor: errors.pricePerKg ? 'red' : 'blue',
                },
              },
            }}
          />

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleClear}
              sx={{
                color: 'red',
                borderColor: 'red',
                borderRadius: '10px',
                textTransform: 'uppercase',
                px: 4,
                py: 1,
              }}
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: '#1976d2',
                borderRadius: '10px',
                textTransform: 'uppercase',
                px: 4,
                py: 1,
                '&:hover': { bgcolor: '#1565c0' },
              }}
            >
              {initialData ? 'Update' : 'Submit'}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default NewMaterialForm;