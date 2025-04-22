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

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const menuItems = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Check-in History', route: '/history' },
    { label: 'Mood Trends', route: '/mood' },
    { label: 'AI Insights', route: '/ai' },
  ];

  return (
    <Box>
      <IconButton
        onClick={handleMenuOpen}
        sx={{ color: 'inherit', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.21)' } }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        slotProps={{ paper: { sx: { boxShadow: '0px 0px 8px 2px rgba(0, 0, 0, 0.2)' } } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 1.8, ml: 3.5 }}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.route}
            onClick={() => { navigate(item.route); handleMenuClose(); }}
            selected={location.pathname === item.route}
            sx={{
              '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline', textUnderlineOffset: '4px' },
              '&.Mui-selected': { backgroundColor: 'rgba(0, 0, 0, 0.08)', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.12)' } },
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
      .then((res) => setUsername(res.data.name || ''))
      .catch((err) => console.error('Failed to fetch username:', err));
  }, []);

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
    <Box sx={{ position: 'relative', mb: 4, boxShadow: '0px 2px 7px rgba(0, 0, 0, 0.20)', transition: 'box-shadow 0.3s ease-in-out' , height: {xs:'75%',md:'100%'}}}>
      {/* translucent overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgb(255, 255, 254)',
          zIndex: 0,
        }}
      />
      {/* header content: 保持贴边，只在小屏缩小字体和图标 */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          px: { xs: 0.25, md: 5 },
          py: 1.75,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* 左侧：菜单 + 标题 + 面包屑 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: {xs:0.25, md:1} }}>
          <NavigationMenu />
          <Typography
            variant="h4"
            sx={{ fontSize: { xs: 16, md: 30 }, fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          >
            MindCare
          </Typography>
          {currentLabel && (
            <Typography variant="h4" sx={{ fontSize: { xs:0, md: 27 }, color: 'gray' }}>
              {` / ${currentLabel}`}
            </Typography>
          )}
        </Box>

        {/* 右侧：用户名 + 头像 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: {xs:0.25, md:1.5} }}>
          <Typography
            sx={{ fontSize: { xs: 14, md: 20 }, fontWeight: 'bold', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => navigate('/userprofile')}
          >
            {username || 'Username'}
          </Typography>
          <Avatar
            onClick={() => navigate('/userprofile')}
            sx={{
              cursor: 'pointer',
              bgcolor: 'transparent',
              border: '2px solid black',
              width: { xs: 32, md: 48 },
              height: { xs: 32, md: 48 },
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
      <Box sx={{ px: { xs: 3, md: 5 } }}>{children}</Box>
    </Box>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;