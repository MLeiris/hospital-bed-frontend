import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: '#f7f7f7' }}>
      <Navbar />
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: 'calc(100% - 240px)'
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;