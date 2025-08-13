import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { getWardStats } from '../../api/wards';
import WardList from '../../components/Wards/WardList';
import WardForm from '../../components/Wards/WardForm';

const AdminDashboard = () => {
  const [wardStats, setWardStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

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
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {wardStats.map((ward) => (
          <Grid item xs={12} sm={6} md={4} key={ward.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{ward.name}</Typography>
                <Typography>Capacity: {ward.capacity}</Typography>
                <Typography>Occupied: {ward.occupied_beds}</Typography>
                <Typography>Available: {ward.available_beds}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
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
        <WardList wards={wardStats} />
      </Box>
    </Container>
  );
};

export default AdminDashboard;