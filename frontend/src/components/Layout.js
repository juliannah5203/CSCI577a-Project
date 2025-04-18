import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  CssBaseline,
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';

// NavigationMenu Component
const NavigationMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const menuItems = [

    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Check-in History', route: '/history' },
    { label: 'Mood Trends', route: '/mood' },
    { label: 'AI Insights', route: '/ai' },
  ];

  const handleMenuItemClick = (route) => {
    navigate(route);
    handleMenuClose();
  };

  return (
    <Box>
      <IconButton
        onClick={handleMenuOpen}
        sx={{
          color: 'inherit',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.21)',
          },
        }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              // even glow on all edges
              boxShadow: '0px 0px 8px 2px rgba(0, 0, 0, 0.2)',
            },
          },
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 1.8, ml: 3.5 }}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.route}
            onClick={() => handleMenuItemClick(item.route)}
            selected={location.pathname === item.route}
            sx={{
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.12)',
                },
              },
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

// HeaderSection Component
const HeaderSection = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios
      .get('http://localhost:5001/api/users/profile', { withCredentials: true })
      .then((res) => {
        setUsername(res.data.name || '');
      })
      .catch((err) => {
        console.error('Failed to fetch username:', err);
      });
  }, [navigate]);

  const pageLabels = {
    '/dashboard': '',
    '/history': 'Check-in History',
    '/mood': 'Mood Trends',
    '/ai': 'AI Insights',
    '/userprofile': 'User Profile',
    '/checkin': 'Check-in',

  };
  const currentLabel = pageLabels[location.pathname] || '';

  return (
    <Box
      sx={{
        position: 'relative',
        mb: 4,
        boxShadow: '0px 2px 7px rgba(0, 0, 0, 0.20)',
        transition: 'box-shadow 0.3s ease-in-out',
      }}
    >
      {/* translucent full-width overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          width: '100vw',
          height: '100%',
          backgroundColor: 'rgb(255, 255, 254)',
          zIndex: 0,
        }}
      />
      {/* header content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          px: { xs: 3, md: 5 },
          py: 1.75,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Left: menu + title + dynamic page name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NavigationMenu />
          <Typography
            variant="h4"
            fontWeight="bold"
            fontSize={30}
            onClick={() => navigate('/dashboard')}
            sx={{ cursor: 'pointer' }}
          >
            MindCare
          </Typography>
          {currentLabel && (
            <Typography variant="h4"  fontSize={27} sx={{ color: 'gray' }}>
              {` / ${currentLabel}`}
            </Typography>
          )}
        </Box>


        {/* Right: user info + avatar */}
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              // position: 'relative',
              // top: '10px',
            }}
          >
            <Typography
              fontSize={20}
              fontWeight="bold"
              onClick={() => navigate('/userprofile')}
              sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              {username || 'Username'}
            </Typography>
            {/* <Typography
              fontSize={14}
              variant="body2"
              onClick={() => navigate('/settings')}
              sx={{ cursor: 'pointer', mt: -0.1, '&:hover': { textDecoration: 'underline' } }}
            >
              Settings
            </Typography> */}
          </Box>
          <Avatar
            onClick={() => navigate("/userprofile")}
            sx={{
              cursor: "pointer",
              bgcolor: "transparent",
              border: "2px solid black",
              width: 48,
              height: 48,
              background: 'conic-gradient(red, yellow, green, red)',
              '&:hover': { boxShadow: '0 0 1px 5px rgba(0, 0, 0, 0.32)' },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

// Layout Component
const Layout = ({ children }) => (
  <>
    <CssBaseline />
    <Box
      sx={{
        backgroundColor: '#e6f4df',
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        pt: 0,
        pb: 3,
        position: 'relative',
        px: 0,
      }}
    >
      <HeaderSection />
      <Box sx={{ px: 3 }}>{children}</Box>
    </Box>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
