import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static" sx={{ height: 64 }}>
      <Toolbar sx={{ minHeight: 56, px: 2 }}>
        <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
          Hospital Bed System
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Welcome, {user.username} ({user.role})
            </Typography>
            <Button color="inherit" size="small" onClick={logout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;