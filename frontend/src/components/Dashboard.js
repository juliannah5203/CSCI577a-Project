import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

// NavigationMenu Component
const NavigationMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { label: "Dashboard", route: "/dashboard" },
    { label: "CheckIn History", route: "/history" },
    { label: "Mood Trends", route: "/mood" },
    { label: "AI Insights", route: "/ai" },
  ];

  const handleMenuItemClick = (route) => {
    navigate(route);
    handleMenuClose();
  };

  return (
    <Box>
      <IconButton onClick={handleMenuOpen} sx={{ color: 'inherit' }}>
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.route}
            onClick={() => handleMenuItemClick(item.route)}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

// Header Section Component
const HeaderSection = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ position: 'relative', mb: 4 }}>
      {/* Full-width transparent overlay background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: -24,
          width: 'calc(100vw + 48px)',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          borderRadius: 3,
          zIndex: 0,
        }}
      />
      {/* Header content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          px: 0.25,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Left: MindCare text */}
        <Typography
          variant="h4"
          fontWeight="bold"
          fontSize={36}
          onClick={() => navigate('/dashboard')}
          sx={{ cursor: 'pointer' }}
        >
          MindCare
        </Typography>
        {/* Center: Navigation menu icon */}
        <NavigationMenu />
        {/* Right: User info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              onClick={() => navigate('/userprofile')}
              sx={{ cursor: 'pointer' }}
            >
              Username
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              onClick={() => navigate('/settings')}
              sx={{ cursor: 'pointer' }}
            >
              Settings
            </Typography>
          </Box>
          <Avatar
            onClick={() => navigate('/userprofile')}
            sx={{
              cursor: 'pointer',
              bgcolor: 'transparent',
              border: '2px solid black',
              width: 48,
              height: 48,
              background: 'conic-gradient(red, yellow, green, red)',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
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
    <Box
      sx={{
        backgroundColor: '#e6f4df',
        minHeight: '100vh',
        pt: 0,
        px: 3,
        pb: 3,
        position: 'relative',
      }}
    >
      <HeaderSection />
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
    </Box>
  );
};

export default Dashboard;
