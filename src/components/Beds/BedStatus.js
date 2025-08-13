import { Box, Typography, LinearProgress } from '@mui/material';

const BedStatus = ({ ward }) => {
  const availablePercentage = (ward.available_beds / ward.capacity) * 100;
  const occupiedPercentage = (ward.occupied_beds / ward.capacity) * 100;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {ward.name} Ward Status
      </Typography>
      <Typography variant="body2" gutterBottom>
        Capacity: {ward.capacity} beds
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={occupiedPercentage} 
            color="error"
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {Math.round(occupiedPercentage)}% occupied
        </Typography>
      </Box>
      <Typography variant="body2">
        {ward.available_beds} available, {ward.occupied_beds} occupied
      </Typography>
    </Box>
  );
};

export default BedStatus;