import { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress, TextField } from '@mui/material';
import { getWardStats } from '../../api/wards';
import WardList from '../../components/Wards/WardList';
import WardForm from '../../components/Wards/WardForm';
import WardGauge from '../../components/Wards/WardGauge';

const AdminDashboard = () => {
  const [wardStats, setWardStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getWardStats();
        setWardStats(response.data);
      } catch (error) {
        console.error('Error fetching ward stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const handleWardCreated = () => {
    setRefresh(prev => !prev);
  };

  const filteredWards = wardStats.filter(ward =>
    ward.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Search Ward"
          variant="outlined"
          value={search}
          onChange={e => setSearch(e.target.value)}
          fullWidth
        />
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add New Ward
        </Typography>
        <WardForm onWardCreated={handleWardCreated} />
      </Box>
      
      <Box>
        <Typography variant="h5" gutterBottom>
          Ward Management
        </Typography>
        {/* Pass filteredWards to WardList for search functionality */}
        <WardList wards={filteredWards} WardGauge={WardGauge} />
      </Box>
    </Container>
  );
};

export default AdminDashboard;