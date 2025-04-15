import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Badge,
  // Avatar,
  // Menu,
  // MenuItem,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
// import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

// Tab/Subheader Section Component
const TabSection = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      px: 0.75,
      mb: 4,
    }}
  >
    <Typography variant="h5" fontWeight="bold" fontSize={28}>
      Dashboard{' '}
      <Typography component="span" fontWeight="normal" color="text.secondary">
        Welcome back!
      </Typography>
    </Typography>
    <Badge
      badgeContent={1}
      color="error"
      sx={{
        '& .MuiBadge-badge': {
          top: -5,
          right: -5,
          transform: 'none',
        },
      }}
    >
      <IconButton
        sx={{
          backgroundColor: 'grey.300',
          borderRadius: '50%',
          p: 1,
        }}
      >
        <NotificationsIcon />
      </IconButton>
    </Badge>
  </Box>
);

const Dashboard = () => {
  const navigate = useNavigate();

  // Dimensions for the cards – adjust these values as needed
  const cardDimensions = {
    checkin: { minHeight: 150 },
    history: { minHeight: 150 },
    mood: { minHeight: 300 },
    ai: { minHeight: 300 },
  };

  return (
    <Layout>
      {/* <HeaderSection /> */}
      <TabSection />

      {/* First row – Check-In & History */}
      <Grid container spacing={3} mb={4} justifyContent="flex-start">
        <Grid item sx={{ flex: '0 0 400px', maxWidth: '400px' }}>
          <Paper
            elevation={4}
            sx={{
              p: 2,
              borderRadius: 4,
              ...cardDimensions.checkin,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/checkin')}
          >
            <Typography variant="h6">
              Check-In{' '}
              <Typography component="span" color="error" fontWeight="bold">
                1
              </Typography>
            </Typography>
          </Paper>
        </Grid>
        <Grid item sx={{ flex: '0 0 400px', maxWidth: '400px' }}>
          <Paper
            elevation={4}
            sx={{
              p: 2,
              borderRadius: 4,
              ...cardDimensions.history,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/history')}
          >
            <Typography variant="h6">History</Typography>
          </Paper>
        </Grid>
      </Grid>

      <hr />

      {/* Second row – Mood Trends & AI-Insights */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={4}
            sx={{
              p: 2,
              borderRadius: 4,
              ...cardDimensions.mood,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/mood')}
          >
            <Typography variant="h6">Mood Trends</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={4}
            sx={{
              p: 2,
              borderRadius: 4,
              ...cardDimensions.ai,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/ai')}
          >
            <Typography variant="h6">AI-Insights</Typography>
          </Paper>
        </Grid>
      </Grid>
    {/* </Box> */}
    </Layout>
  );
};

export default Dashboard;
