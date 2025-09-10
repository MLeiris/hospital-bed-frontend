import { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, CircularProgress, Paper } from '@mui/material';
import PatientForm from '../../components/Patients/PatientForm';
import PatientList from '../../components/Patients/PatientList';
import PatientSearch from '../../components/Patients/PatientSearch';
import { getPatients } from '../../api/patients';

const ReceptionistDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getPatients();
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePatientRegistered = (newPatient) => {
    setPatients(prev => [...prev, newPatient]);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100vw', maxWidth: '100vw', overflowX: 'hidden', bgcolor: '#f7f7f7', minHeight: '100vh', py: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 0 }}>
        <Paper elevation={2} sx={{ p: 3, width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Receptionist Dashboard
          </Typography>
          
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{ mb: 3 }}
          >
            <Tab label="Register Patient" />
            <Tab label="Current Patients" />
            <Tab label="Search Patients" />
          </Tabs>
          
          {tabValue === 0 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Register New Patient
              </Typography>
              <PatientForm onPatientRegistered={handlePatientRegistered} />
            </Box>
          )}
          
          {tabValue === 1 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Current Patients
              </Typography>
              <PatientList patients={patients} showDischargeAction />
            </Box>
          )}
          
          {tabValue === 2 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Search Patients
              </Typography>
              <PatientSearch />
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ReceptionistDashboard;