import { useState, useEffect } from 'react';
import { Button, TextField, Grid, MenuItem, CircularProgress, Alert, Box } from '@mui/material';
import { registerPatient } from '../../api/patients';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const PatientForm = ({ onPatientRegistered }) => {
  const [wards, setWards] = useState([]);
  const [loadingWards, setLoadingWards] = useState(true);
  const [wardError, setWardError] = useState('');
  const { token } = useAuth();

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    age: Yup.number().required('Age is required').positive().integer(),
    gender: Yup.string().required('Gender is required'),
    medical_condition: Yup.string().required('Medical condition is required'),
    ward_name: Yup.string().required('Ward is required'),
  });

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/wards', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWards(response.data);
      } catch (error) {
        toast.error('Failed to fetch wards');
      } finally {
        setLoadingWards(false);
      }
    };
    fetchWards();
  }, [token]);

  // Custom toast for ward full error
  const showWardFullError = (wardName) => {
    toast.error(`"${wardName}" has no available beds!`, {
      position: "top-center",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: { 
        backgroundColor: '#f44336', 
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        border: '2px solid #d32f2f'
      },
      progressStyle: {
        background: '#ffebee'
      }
    });
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setWardError('');

    try {
      const response = await registerPatient(values);
      
      // Show success toast with custom styling
      toast.success(`Patient "${values.name}" registered successfully!`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: { 
          backgroundColor: '#4caf50', 
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold'
        }
      });

      onPatientRegistered(response.data);
      resetForm();
    } catch (error) {
      // Handle backend validation errors for no available beds
      if (error.response?.status === 400 && error.response?.data?.error?.includes('No available beds')) {
        const errorMessage = error.response.data.error;
        setWardError(errorMessage);
        showWardFullError(values.ward_name);
      } else {
        const backendError =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          'Registration failed';
        
        toast.error(backendError, {
          position: "top-right",
          autoClose: 5000,
          style: { 
            backgroundColor: '#ff9800', 
            color: 'white',
            fontSize: '14px'
          }
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        name: '',
        age: '',
        gender: '',
        medical_condition: '',
        ward_name: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Ward Error Alert */}
            {wardError && (
              <Grid item xs={12}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2,
                    border: '1px solid #f44336',
                    backgroundColor: '#ffebee',
                    '& .MuiAlert-icon': { color: '#d32f2f' }
                  }}
                >
                  <strong>No Available Beds!</strong> {wardError}
                </Alert>
              </Grid>
            )}
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={values.age}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.age && Boolean(errors.age)}
                helperText={touched.age && errors.age}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Gender"
                name="gender"
                value={values.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.gender && Boolean(errors.gender)}
                helperText={touched.gender && errors.gender}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Ward"
                name="ward_name"
                value={values.ward_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.ward_name && Boolean(errors.ward_name)}
                helperText={touched.ward_name && errors.ward_name}
                disabled={loadingWards}
              >
                {loadingWards ? (
                  <MenuItem value="">
                    <Box display="flex" alignItems="center">
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading wards...
                    </Box>
                  </MenuItem>
                ) : (
                  wards.map((ward) => (
                    <MenuItem key={ward.id} value={ward.name}>
                      {ward.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Medical Condition"
                name="medical_condition"
                value={values.medical_condition}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.medical_condition && Boolean(errors.medical_condition)}
                helperText={touched.medical_condition && errors.medical_condition}
                multiline
                rows={3}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || loadingWards}
                sx={{ 
                  mt: 2,
                  px: 4,
                  py: 1.5,
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting ? 'Registering Patient...' : 'Register Patient'}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default PatientForm;