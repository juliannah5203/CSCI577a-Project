import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

// NavigationMenu Component
const NavigationMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
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

// Header Section Component with transparent overlay and a fixed minHeight
const HeaderSection = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ position: 'relative', mb: 4, minHeight: '80px' }}>
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

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    region: '',
    sex: '',
    profilePicture: '',
  });
  const [originalProfile, setOriginalProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  // Fetch user profile
  useEffect(() => {
    axios.get('/api/users/profile', { withCredentials: true })
      .then(res => {
        const data = res.data;
        const newProfile = {
          name: data.name || '',
          email: data.email || '',
          region: data.region || '',
          sex: data.sex || '',
          profilePicture: data.profilePicture || '',
        };
        setProfile(newProfile);
        setOriginalProfile(newProfile);
      })
      .catch(err => console.error('Failed to fetch profile:', err));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    if (!editing) setOriginalProfile(profile);
    else setProfile(originalProfile);
    setEditing(!editing);
  };

  const handleSave = () => {
    const { name, region, sex } = profile;
    axios.put('/api/users/profile', { name, region, sex }, { withCredentials: true })
      .then(() => {
        setEditing(false);
      })
      .catch(err => {
        console.error('Update failed:', err);
        alert('Failed to save profile. Reverting changes.');
        setProfile(originalProfile);
        setEditing(false);
      });
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

      <div style={styles.profileCard}>
        <div style={styles.avatarRow}>
          <img
            src={profile.profilePicture || '/default-avatar.png'}
            alt="avatar"
            style={styles.avatar}
          />
          <div style={{ flex: 1 }}>
            <h2>{profile.name}</h2>
          </div>
          <button onClick={handleEditToggle} style={styles.editBtn}>
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div style={styles.infoRow}>
          <strong>Name:</strong>
          {editing ? (
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              style={styles.input}
            />
          ) : (
            profile.name
          )}
        </div>

        <div style={styles.infoRow}>
          <strong>Email:</strong> {profile.email}
        </div>

        <div style={styles.infoRow}>
          <strong>Sex:</strong>
          {editing ? (
            <select
              name="sex"
              value={profile.sex}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            profile.sex
          )}
        </div>

        <div style={styles.infoRow}>
          <strong>Region:</strong>
          {editing ? (
            <input
              name="region"
              value={profile.region}
              onChange={handleChange}
              style={styles.input}
            />
          ) : (
            profile.region
          )}
        </div>

        {editing && (
          <div style={{ textAlign: 'right' }}>
            <button onClick={handleSave} style={styles.saveBtn}>
              Save
            </button>
          </div>
        )}
      </div>
    </Box>
  );
};

const styles = {
  profileCard: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: '2rem auto',
  },
  avatarRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem',
    gap: '1rem',
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  editBtn: {
    background: '#000',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  saveBtn: {
    background: '#4caf50',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    marginTop: '1rem',
    cursor: 'pointer',
  },
  infoRow: {
    backgroundColor: '#f5f8f3',
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginLeft: '1rem',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
};

export default UserProfile;
