import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  LocalHospital as HospitalIcon,
  Assignment as AssignmentIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const adminItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'User Management', icon: <PeopleIcon />, path: '/admin/users' }
  ];

  const doctorItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/doctor/dashboard' },
    { text: 'Patients', icon: <HospitalIcon />, path: '/doctor/dashboard' }
  ];

  const receptionistItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/receptionist/dashboard' },
    { text: 'Patients', icon: <HospitalIcon />, path: '/receptionist/dashboard' }
  ];

  const getMenuItems = () => {
    switch(user?.role) {
      case 'admin':
        return adminItems;
      case 'doctor':
        return doctorItems;
      case 'receptionist':
        return receptionistItems;
      default:
        return [];
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          marginTop: '64px'
        },
      }}
    >
      <List>
        {getMenuItems().map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;