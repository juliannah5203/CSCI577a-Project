import React from 'react';
import {
  Box,
  Typography,
//   Grid,
//   Paper,
  IconButton,
//   Badge,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
// import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'https://your-api-base-url.com'; // Change this for debugging

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
          left: -35,
          width: 'calc(100vw)',
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

// CheckIn Component that uses HeaderSection
const CheckIn = () => {
  const [selectedMood, setSelectedMood] = React.useState(2);
  const [notes, setNotes] = React.useState('');
  const [insights, setInsights] = React.useState(null);
  const navigate = useNavigate();

  // Get current date in the required format
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const moods = [
    { emoji: '😔', borderColor: '#9370DB', label: 'Sad' },
    { emoji: '😕', borderColor: '#FFA07A', label: 'Worried' },
    { emoji: '😐', borderColor: '#8B4513', label: 'Neutral' },
    { emoji: '🙂', borderColor: '#4CAF50', label: 'Good' },
    { emoji: '😄', borderColor: '#4169E1', label: 'Great' },
  ];

  const handleMoodSelect = (index) => {
    setSelectedMood(index);
  };

  const handleSubmit = async () => {
    try {
      // Submit the check-in
      const checkinResponse = await axios.post(`${BASE_URL}/api/checkins`, {
        date: currentDate,
        moodRating: selectedMood + 1, // Assuming moodRating is 1-5
        note: notes,
      });

      if (checkinResponse.status === 201) {
        // Retrieve AI insights
        const insightsResponse = await axios.get(`${BASE_URL}/api/insights`);
        if (insightsResponse.status === 200) {
          setInsights(insightsResponse.data.insights);
        }
      }
    } catch (error) {
      console.error('Error submitting check-in or retrieving insights:', error);
    }
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
      
      {/* Check-in Form Content */}
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        {/* Date Display */}
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#2e5c1e',
            mb: 4,
            fontWeight: 500
          }}
        >
          {currentDate}
        </Typography>

        {/* Mood Question */}
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#2e5c1e',
            mb: 3,
            fontWeight: 500,
            fontSize: '2rem'
          }}
        >
          How are you feeling today?
        </Typography>

        {/* Mood Selection */}
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            mb: 4,
            backgroundColor: '#d8ecd0',
            p: 3,
            borderRadius: 2,
          }}
        >
          {moods.map((mood, index) => (
            <Box
              key={index}
              onClick={() => handleMoodSelect(index)}
              sx={{
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: '50%',
                cursor: 'pointer',
                border: selectedMood === index ? `3px solid ${mood.borderColor}` : '2px solid #ccc',
                boxShadow: selectedMood === index ? `0 0 10px ${mood.borderColor}40` : 'none',
                transition: 'all 0.2s ease',
                fontSize: '2rem',
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
            >
              {mood.emoji}
            </Box>
          ))}
        </Box>

        {/* Notes Section */}
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#2e5c1e',
            mb: 2,
            fontWeight: 500
          }}
        >
          Notes(optional)
        </Typography>
        <Box
          component="textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{
            width: 'calc(100% - 32px)',
            minHeight: '150px',
            borderRadius: '10px',
            border: '1px solid #ccc',
            padding: 2,
            mb: 3,
            resize: 'vertical',
            fontFamily: 'inherit',
            fontSize: '1rem',
            backgroundColor: 'white',
            '&:focus': {
              outline: 'none',
              borderColor: '#4CAF50',
              boxShadow: '0 0 5px rgba(76, 175, 80, 0.2)'
            }
          }}
        />

        {/* Action Buttons */}
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 2
          }}
        >
          <Box
            component="button"
            onClick={() => navigate('/dashboard')}
            sx={{
              padding: '10px 30px',
              borderRadius: '20px',
              border: '1px solid #ccc',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              }
            }}
          >
            Cancel
          </Box>
          <Box
            component="button"
            onClick={handleSubmit}
            sx={{
              padding: '10px 30px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: '#4CAF50',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: '#45a049',
              }
            }}
          >
            Submit
          </Box>
        </Box>

        {insights && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 500 }}>
              AI Insights
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {insights.summary}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Recommendations:
            </Typography>
            <ul>
              {insights.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CheckIn;
