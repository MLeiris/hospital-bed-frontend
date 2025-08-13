import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, [token]);

 const login = async (token) => {
  try {
    localStorage.setItem('token', token);
    setToken(token);
    const decoded = jwtDecode(token);
    setUser(decoded);

    // Redirect based on role
    switch (decoded.role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'doctor':
        navigate('/doctor/dashboard');
        break;
      case 'receptionist':
        navigate('/receptionist/dashboard');
        break;
      default:
        navigate('/');
    }
    
    toast.success('Login successful!');
    } catch (error) {
    console.error('Token decoding failed:', error);
    toast.error('Login failed. Invalid token.');
  }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
    toast.info('Logged out successfully');
  };

  const isAuthenticated = () => {
    return token !== null;
  };

  const hasRole = (requiredRole) => {
    return user?.role === requiredRole;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);