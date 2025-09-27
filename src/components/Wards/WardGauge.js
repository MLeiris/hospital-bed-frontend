import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const getBarColor = (occupancy) => {
  if (occupancy > 0.9) return 'error';   
  if (occupancy > 0.7) return 'warning'; 
  return 'success';                      
};

const WardGauge = ({ wardName, capacity, occupied }) => {
  const occupancy = capacity ? occupied / capacity : 0;
  const color = getBarColor(occupancy);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>{wardName}</Typography>
      <LinearProgress
        variant="determinate"
        value={occupancy * 100}
        color={color}
        sx={{
          height: 18,
          borderRadius: 9,
          backgroundColor: "#e0f2e9",
          '& .MuiLinearProgress-bar': {
            backgroundColor: "#1ec773",
          },
        }}
      />
      <Box sx={{ mt: 1, textAlign: 'center' }}>
        <Typography variant="body2">
          {occupied} / {capacity} beds occupied ({Math.round(occupancy * 100)}%)
        </Typography>
      </Box>
    </Box>
  );
};

export default WardGauge;