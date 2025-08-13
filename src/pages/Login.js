import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login as loginAPI } from '../api/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Container, TextField, Typography,
  Paper, CircularProgress
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';

const Login = () => {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

const handleSubmit = async (values) => {
  setIsSubmitting(true);
  setError('');

  try {
    const data = await loginAPI(values.username, values.password);

    if (!data?.token) {
      throw new Error('Authentication failed: No token received');
    }

    await authLogin(data.token);
    toast.success(`Welcome back, ${data.user?.username || values.username}!`);

  } catch (err) {
    console.error('Login error:', err);
    const errorMessage = err.message || 'Login failed. Please check your credentials.';
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};



  return (
    <Container maxWidth="xs">
      <ToastContainer position="top-right" autoClose={5000} />
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Hospital Bed System
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Please sign in
        </Typography>

        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  disabled={isSubmitting}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  disabled={isSubmitting}
                />
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ height: '48px' }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          )}
        </Formik>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            onClick={() => navigate('/register')}
            disabled={isSubmitting}
            color="secondary"
          >
            Don't have an account? Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
