import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
 
//   Grid,
//   Paper,
  // IconButton,
//   Badge,
  // Avatar,
  // Menu,
  // MenuItem,
} from '@mui/material';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const BASE_URL = 'http://localhost:5001';

// Configure axios defaults
axios.defaults.withCredentials = true; // Enable sending cookies with requests

// CheckIn Component that uses HeaderSection
const CheckIn = () => {
  const [selectedMood, setSelectedMood] = React.useState(2);
  const [notes, setNotes] = React.useState('');
  const [insights, setInsights] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const insightsCardRef = useRef(null);

  // Get current date in the required format
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Get user ID on component mount
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/users/profile`, {
          withCredentials: true
        });
        setUserId(response.data.userId ?? response.data.id);
      } catch (error) {
        console.error('Error getting user profile:', error);
      }
    };
    getUserProfile();
  }, []);

  // Check if user has already checked in today
  useEffect(() => {
    const checkTodayCheckIn = async () => {
      if (!userId) return; // Don't check if we don't have userId yet
      
      try {
        const response = await axios.get(`${BASE_URL}/api/checkins/${userId}`, {
          withCredentials: true
        });
        const today = new Date().toDateString();
        const hasCheckedIn = response.data.some(item => 
          new Date(item.date).toDateString() === today
        );
        setHasCheckedInToday(hasCheckedIn);
      } catch (error) {
        console.error('Error checking today\'s check-in:', error);
      }
    };

    checkTodayCheckIn();
  }, [userId]); // Run this effect when userId changes

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
      setError(null); // Clear any previous errors
      
      // Submit the check-in
      const checkinResponse = await axios.post(`${BASE_URL}/api/checkins`, {
        date: currentDate,
        moodRating: selectedMood + 1,
        note: notes,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Include credentials
      });
      if (checkinResponse.status === 200 || checkinResponse.status === 201) {
        console.log(checkinResponse)
        setInsights(checkinResponse.data.ai_feedback);
        setHasCheckedInToday(true); // Update state after successful submission
        // Optionally navigate to dashboard or show success message
        // navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          setError('Please log in to submit your check-in.');
          // Optionally redirect to login
          // navigate('/login');
        } else {
          setError('An error occurred while submitting your check-in. Please try again.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('Unable to reach the server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  useEffect(() => {
    if (insights && insightsCardRef.current) {
      insightsCardRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [insights]);

  return (
    <Layout>
      
      {/* Check-in Form Content */}
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        {/* Show error message if exists */}
        {error && (
          <Box 
            sx={{ 
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: 2,
              borderRadius: 1,
              mb: 2
            }}
          >
            <Typography>{error}</Typography>
          </Box>
        )}

        {/* Date Display */}
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 2,
            fontWeight: "bold",
          }}
        >
          {currentDate}
        </Typography>

        {/* Mood Question */}
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2,
            fontWeight: 500,

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
            mb: 2,
            backgroundColor: 'white',
            boxShadow: '1px 1px 3px rgba(0,0,0,0.29)',
            p: 3,
            borderRadius: 4,
          }}
        >
          {moods.map((mood, index) => (
            <Box
              key={index}
              onClick={() => handleMoodSelect(index)}
              sx={{
                width: {xs: '45px', md:'60px'},
                height: {xs: '45px', md:'60px'},
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: '50%',
                cursor: 'pointer',
                
                border: selectedMood === index ? `2px solid ${mood.borderColor}` : 'none',
                boxShadow: selectedMood === index ? `2px 2px 10px rgba(0,0,0,0.46)` : '0px 2px 5px rgba(0,0,0,0.29)',
                transition: 'all 0.3s ease',
                fontSize: {xs:'2.5rem',md:'3.5rem'},
                paddingTop: 0.4,
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '3px 6px 6px rgba(0,0,0,0.46)',
                }
              }}
            >
              {mood.emoji}
            </Box>
          ))}
        </Box>

        {/* Notes Section */}
        <Typography 
          variant="h6" 
          sx={{ 
            // color: '#2e5c1e',
            mb: 2,
            fontWeight: 500,
          }}
        >
          Notes (optional)
        </Typography>
        <Box
          component="textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{
            width: '100%',
            minHeight: '150px',
            borderRadius: 4,
            border: '1px solid #ccc',
            boxShadow: '1px 1px 3px rgba(0,0,0,0.29)',
            transition: 'all 0.3s ease',
            padding: 2,
            mb: 3,
            resize: 'vertical',
            fontFamily: 'inherit',
            fontSize: '1rem',
            backgroundColor: 'white',
            '&:focus': {
              outline: 'none',
              borderColor: '#4CAF50',
              boxShadow: '4px 4px 5px rgba(0,0,0,0.46)'
            },
            '&:hover': {
              boxShadow: '4px 4px 5px rgba(0,0,0,0.46)'

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
              borderRadius: 4,
              border: 'none',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'box-shadow 0.3s ease',
              boxShadow: '1px 1px 3px rgba(0,0,0,0.29)',
              '&:hover': {
              boxShadow: '2px 2px 4px rgba(0,0,0,0.46)'


            }
            }}
          >
            Cancel
          </Box>
          <Box
            component="button"
            onClick={handleSubmit}
            disabled={hasCheckedInToday}
            sx={{
              padding: '10px 30px',
              borderRadius: 4,
              border: 'none',
              backgroundColor: hasCheckedInToday ? '#cccccc' : 'white',
              color: 'green',
              cursor: hasCheckedInToday ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              transition: 'box-shadow 0.3s ease',
              fontWeight:  'bold',
              boxShadow: '1px 1px 3px rgba(0,0,0,0.29)',

              '&:hover': {
                // backgroundColor: hasCheckedInToday ? '#cccccc' : '#45a049',
              boxShadow: '4px 4px 5px rgba(0,0,0,0.46)',
              },
              '&:disabled': {
                color:"gray",
                opacity: 0.95,
                boxShadow: 'none',
              }
            }}
          >
            {hasCheckedInToday ? 'Already Checked In Today' : 'Submit'}
          </Box>
        </Box>

        {insights && (
          <Card 
            ref={insightsCardRef}
            elevation={3}
            sx={{ 
              mt: 4,
              backgroundColor: '#f8faf6',
              borderRadius: 4,
              // border: '1px solid #e0e0e0',
              boxShadow: '1px 1px 3px rgba(0,0,0,0.29)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LightbulbIcon sx={{ color: '#4CAF50', mr: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 500, color: '#2e5c1e' }}>
                  AI Insights
                </Typography>
              </Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  mt: 2,
                  color: '#333',
                  lineHeight: 1.6,
                  fontSize: '1.1rem'
                }}
              >
                {insights}
              </Typography>
              
              
            </CardContent>
          </Card>
        )}
      </Box>
    </Layout>
  );
};

export default CheckIn;
