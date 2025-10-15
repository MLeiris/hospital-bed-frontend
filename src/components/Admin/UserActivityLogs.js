import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Alert,
  Chip,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { Refresh, Close, Error as ErrorIcon } from '@mui/icons-material';

function UserActivityLogs({ userId, token, onClose, userName }) {
  // *** DIAGNOSTIC LOG ADDED HERE ***
  console.log('UserActivityLogs mounted. Prop userId value:', userId);
  // ********************************
  
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchActivityLogs = useCallback(async () => {
    if (!userId) {
      setError('No user ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching activity logs for user ID: ${userId}`);
      
      const response = await fetch(`/api/admin/Test_Route_A1b2/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response content-type:', response.headers.get('content-type'));

      const responseText = await response.text();
      console.log('Response text (first 200 chars):', responseText.substring(0, 200));

      // Check if response is HTML (error page)
      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
        throw new Error('Server returned HTML error page. Check API endpoint.');
      }

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      console.log('Parsed data:', data);

      if (data.success) {
        setLogs(data.data || []);
        if (data.data && data.data.length === 0) {
          console.log('No logs found for user:', userId);
        }
      } else {
        throw new Error(data.error || 'Failed to fetch activity logs');
      }
    } catch (err) {
      console.error('Activity log fetch error:', err);
      setError(err.message || 'Failed to load activity logs');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    fetchActivityLogs();
  }, [fetchActivityLogs, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const formatTimestamp = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch (err) {
      return 'Invalid Date';
    }
  };

  const getActionColor = (action) => {
    const actionColors = {
      'Logged in': 'success',
      'Registered': 'primary',
      'Logged out': 'warning',
      'Deleted': 'error',
      'Updated': 'info',
      'Created': 'success',
    };
    return actionColors[action] || 'default';
  };

  return (
    <Paper sx={{ p: 3, mt: 2, position: 'relative' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Activity Logs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            User: {userName || 'Unknown'} (ID: {userId})
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Refresh />}
            onClick={handleRetry}
            disabled={loading}
          >
            Refresh
          </Button>
          {onClose && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Close />}
              onClick={onClose}
            >
              Close
            </Button>
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Error Display */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Retry
            </Button>
          }
        >
          {error}
          {error.includes('HTML error page') && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Please check:
              <br />• API endpoint URL
              <br />• Server routing
              <br />• Authentication
            </Typography>
          )}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box 
          display="flex" 
          flexDirection="column" 
          justifyContent="center" 
          alignItems="center" 
          minHeight={120}
          gap={2}
        >
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Loading activity logs...
          </Typography>
        </Box>
      )}

      {/* No Logs Found */}
      {!loading && !error && logs.length === 0 && (
        <Card variant="outlined">
          <CardContent>
            <Box textAlign="center" py={3}>
              <ErrorIcon color="disabled" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Activity Logs Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No activity records found for this user.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Logs List */}
      {!loading && !error && logs.length > 0 && (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="body2" color="text.secondary">
              Showing {logs.length} most recent activities
            </Typography>
            <Chip 
              label={`${logs.length} activities`} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          </Box>
          
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {logs.map((log, index) => (
              <ListItem 
                key={log.id} 
                divider={index < logs.length - 1}
                sx={{ py: 1.5 }}
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Chip 
                        label={log.action} 
                        size="small" 
                        color={getActionColor(log.action)}
                        variant="outlined"
                      />
                      <Typography variant="subtitle2" component="span">
                        by {log.user}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" color="text.primary">
                        {formatTimestamp(log.timestamp)}
                      </Typography>
                      {log.location && (
                        <Typography variant="caption" color="text.secondary">
                          Location: {log.location}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Paper>
  );
}

export default UserActivityLogs;