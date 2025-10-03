import { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, CircularProgress, Paper } from '@mui/material';
import PatientForm from '../../components/Patients/PatientForm';
import PatientList from '../../components/Patients/PatientList';
import PatientSearch from '../../components/Patients/PatientSearch';
import { getPatients, dischargePatient } from '../../api/patients'; 
import { toast } from 'react-toastify'; 

// --- COLOR PALETTE DEFINITIONS ---
const PRIMARY_BEIGE = '#fbf8f3'; // Soft screen background
const DARK_CHOCOLATE = '#4f332d'; // Dark contrast for text/tabs
const LIGHT_ACCENT = '#d3c9ba';  // Subtle highlight/indicator

const ReceptionistDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getPatients();
        const admittedPatients = response.data.filter(p => !p.discharged); 
        setPatients(admittedPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to load patients.');
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
    setTabValue(1); 
  };

  const handlePatientDischarge = (patientId) => {
    setPatients(prevPatients => prevPatients.filter(patient => patient.id !== patientId));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress sx={{ color: DARK_CHOCOLATE }} />
      </Box>
    );
  }

  return (
    // 1. Main Background Color Change
    <Box sx={{ width: '100vw', maxWidth: '100vw', overflowX: 'hidden', bgcolor: PRIMARY_BEIGE, minHeight: '100vh', py: 4 }}>
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', px: 2 }}>
        {/* 2. Paper Style & Elevation */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: 5, 
            width: '100%', 
            borderRadius: 2, 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', // Softer shadow
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ color: DARK_CHOCOLATE, fontWeight: 500 }}
          >
            Receptionist Dashboard
          </Typography>
          
          {/* 3. Custom Tab Styling */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{ mb: 4, borderBottom: `1px solid ${LIGHT_ACCENT}` }}
            // Set the indicator color to the chocolate tone
            TabIndicatorProps={{
              sx: { backgroundColor: DARK_CHOCOLATE, height: 3 }
            }}
          >
            <Tab 
              label="Register Patient" 
              sx={{ 
                color: tabValue === 0 ? DARK_CHOCOLATE : 'text.secondary', 
                fontWeight: tabValue === 0 ? 600 : 400 
              }} 
            />
            <Tab 
              label="Current Patients" 
              sx={{ 
                color: tabValue === 1 ? DARK_CHOCOLATE : 'text.secondary', 
                fontWeight: tabValue === 1 ? 600 : 400 
              }} 
            />
            <Tab 
              label="Search Patients" 
              sx={{ 
                color: tabValue === 2 ? DARK_CHOCOLATE : 'text.secondary', 
                fontWeight: tabValue === 2 ? 600 : 400 
              }} 
            />
          </Tabs>
          
          {tabValue === 0 && (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ color: DARK_CHOCOLATE }}>
                Register New Patient
              </Typography>
              <PatientForm onPatientRegistered={handlePatientRegistered} />
            </Box>
          )}
          
          {tabValue === 1 && (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ color: DARK_CHOCOLATE }}>
                Current Patients
              </Typography>
              <PatientList 
                patients={patients} 
                showDischargeAction 
                onDischarge={handlePatientDischarge} 
              />
            </Box>
          )}
          
          {tabValue === 2 && (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ color: DARK_CHOCOLATE }}>
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