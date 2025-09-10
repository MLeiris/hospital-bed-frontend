import { useState, useEffect } from 'react';
import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { getUsers, deleteUsers } from '../../api/wards';
import { useAuth } from '../../context/AuthContext';
import Chip from '@mui/material/Chip';
import { register } from '../../api/auth';

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'receptionist', label: 'Receptionist' }
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { hasRole } = useAuth();

  // Add user form state
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: ''
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    setAddSuccess('');
    try {
      const response = await register(newUser.username, newUser.password, newUser.role);
      setAddSuccess('User added successfully!');
      setUsers((prev) => [...prev, response]);
      setNewUser({ username: '', password: '', role: '' });
      setShowForm(false);
    } catch (error) {
      setAddError(error.response?.data?.message || 'Failed to add user');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUsers(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  if (!hasRole('admin')) {
    return (
      <Container>
        <Typography color="error">You don't have permission to access this page</Typography>
      </Container>
    );
  }

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
        User Management
      </Typography>

      {/* Button to open popup */}
      <Box sx={{ mb: 4 }}>
        <Button variant="contained" onClick={() => setShowForm(true)}>
          Add New User
        </Button>
      </Box>

      {/* Popup Form */}
      <Dialog open={showForm} onClose={() => setShowForm(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <Box component="form" onSubmit={handleAddUser}>
          <DialogContent sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', minWidth: 350 }}>
            <TextField
              label="Username"
              name="username"
              value={newUser.username}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={newUser.password}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              select
              label="Role"
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
              required
              fullWidth
            >
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            {addError && <Typography color="error" sx={{ mt: 2, width: '100%' }}>{addError}</Typography>}
            {addSuccess && <Typography color="success.main" sx={{ mt: 2, width: '100%' }}>{addSuccess}</Typography>}
          </DialogContent>
          <DialogActions>
            <Button type="submit" variant="contained" disabled={addLoading}>
              {addLoading ? <CircularProgress size={24} /> : 'Add User'}
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    color={
                      user.role === 'admin' ? 'primary' : 
                      user.role === 'doctor' ? 'secondary' : 'default'
                    } 
                  />
                </TableCell>
                <TableCell>
                  <Button size="small" color="error" onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UserManagement;