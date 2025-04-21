// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Badge,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';

// Reusable Card Component with consistent width
const DashboardCard = ({ children, onClick, minHeight }) => (
  <Paper
    onClick={onClick}
    sx={{
      width: '100%',
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
const TabSection = ({ needAlert, onClearAlert }) => {
  const [showMessage, setShowMessage] = useState(false);

  const handleIconClick = () => {
    if (needAlert) setShowMessage(true);
  };

  const handleClose = () => {
    setShowMessage(false);
    onClearAlert();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', px: 0.75, mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" fontSize={32} sx={{ flexGrow: 1 }}>
        Welcome back!
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <Badge
          badgeContent={needAlert ? 1 : 0}
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
            onClick={handleIconClick}
            sx={{
              backgroundColor: 'grey.300',
              borderRadius: '50%',
              p: 1,
              '&:hover': {
                backgroundColor: 'grey.400',
              },
            }}
          >
            <NotificationsIcon />
          </IconButton>
        </Badge>

        {showMessage && (
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: '50%',
              right: '100%',
              transform: 'translateY(-50%)',
              mr: 1,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 4,
              width: 'max-content',
              whiteSpace: 'nowrap',
            }}
          >
            <Typography sx={{ mr: 1 }}>You missed one check-in!</Typography>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

TabSection.propTypes = {
  needAlert: PropTypes.bool.isRequired,
  onClearAlert: PropTypes.func.isRequired,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [needAlert, setNeedAlert] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:5001/api/alert', { withCredentials: true })
      .then((res) => {
        setNeedAlert(res.data.need_alert);
      })
      .catch((err) => {
        console.error('Failed to fetch alert status:', err);
      });
  }, []);

  const handleClearAlert = () => {
    setNeedAlert(false);
    // optionally notify backend to clear alert
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: '60vw', margin: '0 auto', px: 2 }}>
        <TabSection needAlert={needAlert} onClearAlert={handleClearAlert} />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          <DashboardCard onClick={() => navigate('/checkin')} minHeight={200}>
            <Typography variant="h6">
              Check-In{' '}
              {needAlert && (
                <Typography component="span" color="error" fontWeight="bold">
                  1
                </Typography>
              )}
            </Typography>
          </DashboardCard>

          <DashboardCard onClick={() => navigate('/history')} minHeight={200}>
            <Typography variant="h6">History</Typography>
          </DashboardCard>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
            mt: 2,
          }}
        >
          <DashboardCard onClick={() => navigate('/mood')} minHeight={300}>
            <Typography variant="h6">Mood Trends</Typography>
          </DashboardCard>

          <DashboardCard onClick={() => navigate('/ai')} minHeight={300}>
            <Typography variant="h6">AI-Insights</Typography>
          </DashboardCard>
        </Box>
      </Box>
    </Layout>
  );
};

export default Dashboard;
