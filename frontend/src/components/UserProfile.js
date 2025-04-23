import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Stack 
} from '@mui/material';
import Layout from './Layout';

// helper to read the cookie when this component mounts
function getInitialProfile() {
  const raw = Cookies.get('mindcareUser');
  if (!raw) return { name:'', email:'', region:'', sex:'' };
  const { name, email, region, sex } = JSON.parse(raw);
  return { name, email, region, sex };
}

const UserProfile = () => {
  const [profile, setProfile] = useState(getInitialProfile());
  const [originalProfile, setOriginalProfile] = useState(profile);
  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleEditToggle = () => {
    if (editing) {
      setProfile(originalProfile);
    } else {
      setOriginalProfile(profile);
    }
    setEditing(!editing);
  };

  const handleSave = () => {
    const { name, region, sex } = profile;
    axios
      .put(
        'http://localhost:5001/api/users/profile',
        { name, region, sex },
        { withCredentials: true }
      )
      .then(() => {
        setEditing(false);
        Cookies.set(
          'mindcareUser',
          JSON.stringify({ ...profile, email: profile.email }),
          { expires: 7, sameSite: 'Lax' }
        );
      })
      .catch((err) => {
        console.error('Update failed:', err);
        alert('Failed to save profile. Reverting changes.');
        setProfile(originalProfile);
        setEditing(false);
      });
  };

  const handleLogout = () => {
    window.location.href = 'http://localhost:5001/auth/logout';
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Card
          sx={{
            width: '100%',
            maxWidth: 600,
            borderRadius: 4,
            boxShadow: '1px 1px 3px rgba(0,0,0,0.29)',
            border: 'none',
            p: 2,
          }}
        >
          <CardContent>
            <Stack spacing={2}>
              {/* Header with Name and Edit button */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  // px: 3,
                  py: 2,
                  borderRadius: 4,
                }}
              >
                <Typography sx={{ fontWeight: 600, px: 1, fontSize: {xs: '18px', md:'25px' }}}>
                  {profile.name || 'Your Name'}
                </Typography>
                <Button
                  onClick={handleEditToggle}
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: 4,
                    boxShadow: '1px 1px 3px rgba(0,0,0,0.29)',
                    backgroundColor: 'black',
                    color: 'white',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover': {
                      boxShadow: '2px 2px 4px rgba(0,0,0,0.46)',
                    },
                  }}
                >
                  {editing ? 'Cancel' : 'Edit'}
                </Button>
              </Box>

              {/* Name field */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: '#f8faf4',
                  px: 3,
                  py: 2,
                  borderRadius: 4,
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>Name:</Typography>
                {editing ? (
                  <input
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    style={styles.input}
                  />
                ) : (
                  <Typography>{profile.name}</Typography>
                )}
              </Box>

              {/* Email (always read-only) */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: '#f8faf4',
                  px: 3,
                  py: 2,
                  borderRadius: 4,
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>Email:</Typography>
                <Typography>{profile.email}</Typography>
              </Box>

              {/* Gender field */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: '#f8faf4',
                  px: 3,
                  py: 2,
                  borderRadius: 4,
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>Gender:</Typography>
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
                  <Typography>{profile.sex}</Typography>
                )}
              </Box>

              {/* Region field */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: '#f8faf4',
                  px: 3,
                  py: 2,
                  borderRadius: 4,
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>Region:</Typography>
                {editing ? (
                  <input
                    name="region"
                    value={profile.region}
                    onChange={handleChange}
                    style={styles.input}
                  />
                ) : (
                  <Typography>{profile.region}</Typography>
                )}
              </Box>
            </Stack>

            {/* Save button when editing (bottom-right) */}
            {editing && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  onClick={handleSave}
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: 4,
                    boxShadow: '1px 1px 3px rgba(0,0,0,0.29)',
                    backgroundColor: 'green',
                    color: 'white',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover': {
                      boxShadow: '2px 2px 4px rgba(0,0,0,0.46)',
                    },
                  }}
                >
                  Save
                </Button>
              </Box>
            )}

            {/* Logout button (centered bottom) */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                sx={{
                  borderRadius: 4,
                  px: 4,
                  py: 1.5,
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  '&:hover': { boxShadow: 4 },
                }}
              >
                Logout
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

const styles = {
  input: {
    flex: 1,
    marginLeft: '1rem',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
};

export default UserProfile;
