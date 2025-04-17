import React, { useRef, useEffect } from 'react';
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
  const navigate = useNavigate();
  const insightsCardRef = useRef(null);

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
          <Card 
            ref={insightsCardRef}
            elevation={3}
            sx={{ 
              mt: 4,
              backgroundColor: '#f8faf6',
              borderRadius: 3,
              border: '1px solid #e0e0e0'
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
