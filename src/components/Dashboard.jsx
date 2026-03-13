import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Box, Paper, CircularProgress } from '@mui/material';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
         setUser(session.user);
      } else {
         navigate('/'); // redirect to login if not logged in
      }
      setLoading(false);
    };

    getSession();

    // Listen to Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
           setUser(session.user);
        } else {
           navigate('/');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
     return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
     );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ color: '#2C3E50', fontWeight: 'bold' }}>
          Welcome to the Dashboard!
        </Typography>
        <Typography variant="h6" sx={{ color: '#7F8C8D', mb: 4 }}>
          You have successfully logged in/registered via Supabase.
        </Typography>
        
        {user && (
          <Box sx={{ mb: 4, textAlign: 'left', backgroundColor: '#f9f9f9', p: 2, borderRadius: 2 }}>
             <Typography variant="subtitle1" fontWeight="bold">User Information:</Typography>
             <Typography variant="body1">Email: {user.email}</Typography>
             {user.user_metadata && user.user_metadata.username && (
                <Typography variant="body1">Username: {user.user_metadata.username}</Typography>
             )}
          </Box>
        )}

        <Button 
          variant="contained" 
          color="error" 
          size="large" 
          onClick={handleSignOut}
          sx={{ borderRadius: 2 }}
        >
          Sign Out
        </Button>
      </Paper>
    </Container>
  );
}

export default Dashboard;
