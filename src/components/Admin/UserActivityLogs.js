import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper, List, ListItem, ListItemText, Button } from '@mui/material';

function UserActivityLogs({ userId, token, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/activityLogs/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setLogs(data.data || []);
      })
      .catch(err => {
        setLogs([]);
        console.error('Activity log fetch error:', err);
      })
      .finally(() => setLoading(false));
  }, [userId, token]);

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Activity Logs for User ID: {userId}</Typography>
        {onClose && (
          <Button variant="outlined" size="small" onClick={onClose}>
            Close
          </Button>
        )}
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={80}>
          <CircularProgress />
        </Box>
      ) : logs.length === 0 ? (
        <Typography>No activity logs found for this user.</Typography>
      ) : (
        <List>
          {logs.map(log => (
            <ListItem key={log.id} divider>
              <ListItemText
                primary={`${log.action} by ${log.user}`}
                secondary={
                  <>
                    {new Date(log.timestamp).toLocaleString()}
                    {log.location ? ` at ${log.location}` : ''}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}

export default UserActivityLogs;