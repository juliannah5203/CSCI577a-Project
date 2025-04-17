import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Badge,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

// Reusable Card Component with consistent width
const DashboardCard = ({ children, onClick, minHeight }) => (
  <Paper
    onClick={onClick}
    sx={{
      width: '100%', // full width of grid column
      p: 2,
      borderRadius: 4,
      minHeight,
      cursor: 'pointer',
      transition: 'box-shadow 0.3s ease',
      boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.29)',
      '&:hover': {
        boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.46)',
      },
    }}
  >
    {children}
  </Paper>
);

DashboardCard.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  minHeight: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

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
    <Typography variant="h5" fontWeight="bold" fontSize={32}>
      Welcome back!{' '}
      {/* <Typography component="span" fontWeight="normal" color="text.secondary">
        Welcome back!
      </Typography> */}
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

  return (
    <Layout>
      {/* Centered content container */}
      <Box
        sx={{
          maxWidth: '60vw',
          margin: '0 auto',
          px: 2,
        }}
      >
        <TabSection />

        {/* First row – Check-In & History */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          <DashboardCard
            onClick={() => navigate('/checkin')}
            minHeight={200}
          >
            <Typography variant="h6">
              Check-In{' '}
              <Typography component="span" color="error" fontWeight="bold">
                1
              </Typography>
            </Typography>
          </DashboardCard>

          <DashboardCard
            onClick={() => navigate('/history')}
            minHeight={200}
          >
            <Typography variant="h6">History</Typography>
          </DashboardCard>
        </Box>

        {/* <hr /> */}

        {/* Second row – Mood Trends & AI-Insights with longer height */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
            mt: 2,
          }}
        >
          <DashboardCard
            onClick={() => navigate('/mood')}
            minHeight={300}
          >
            <Typography variant="h6">Mood Trends</Typography>
          </DashboardCard>

          <DashboardCard
            onClick={() => navigate('/ai')}
            minHeight={300}
          >
            <Typography variant="h6">AI-Insights</Typography>
          </DashboardCard>
        </Box>
      </Box>
    </Layout>
  );
};

export default Dashboard;
