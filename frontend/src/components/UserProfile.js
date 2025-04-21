import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import Layout from './Layout';
import Cookies from 'js-cookie';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the latest user data from API when component mounts
  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5001/api/users/profile', { withCredentials: true })
      .then((res) => {
        const data = res.data;
        const freshProfile = {
          name: data.name || '',
          email: data.email || '',
          region: data.region || '',
          sex: data.sex || '',
        };
        
        setProfile(freshProfile);
        setOriginalProfile(freshProfile);
        
        // Update cookie with latest data to keep system in sync
        Cookies.set('mindcareUser', JSON.stringify({
          id: data.userId,
          ...freshProfile
        }), { expires: 7, sameSite: 'Lax' });
        
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile data');
        setLoading(false);
      });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  // Toggle edit mode
  const handleEditToggle = () => {
    if (editing) {
      setProfile(originalProfile);
    } else {
      setOriginalProfile(profile);
    }
    setEditing(!editing);
  };

  // Save changes to backend and update cookie
  const handleSave = () => {
    const { name, region, sex } = profile;
    setLoading(true);
    axios
      .put('http://localhost:5001/api/users/profile', { name, region, sex }, { withCredentials: true })
      .then((res) => {
        const updatedData = res.data;
        setEditing(false);
        setLoading(false);
        
        // Update profile with response data to ensure we have server-validated values
        const updatedProfile = {
          name: updatedData.name || profile.name,
          email: updatedData.email || profile.email,
          region: updatedData.region || profile.region,
          sex: updatedData.sex || profile.sex,
        };
        
        setProfile(updatedProfile);
        setOriginalProfile(updatedProfile);
        
        // Update cookie with new profile fields
        Cookies.set('mindcareUser', JSON.stringify({
          id: updatedData.userId || profile.id,
          ...updatedProfile
        }), { expires: 7, sameSite: 'Lax' });
      })
      .catch((err) => {
        console.error('Update failed:', err);
        setError('Failed to save profile changes');
        setProfile(originalProfile);
        setEditing(false);
        setLoading(false);
      });
  };

  // Logout
  const handleLogout = () => {
    window.location.href = 'http://localhost:5001/auth/logout';
  };

  if (loading && !profile.name) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error && !profile.name) {
    return (
      <Layout>
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography color="error">{error}</Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()} 
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={styles.profileCard}>
        {loading && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                     display: 'flex', alignItems: 'center', justifyContent: 'center',
                     backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 1 }}>
            <CircularProgress />
          </Box>
        )}
        
        {error && (
          <Box sx={{ mb: 2, p: 1, bgcolor: '#ffebee', borderRadius: 1 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}
        
        <div style={styles.avatarRow}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5">{profile.name}</Typography>
          </Box>
          <button onClick={handleEditToggle} style={styles.editBtn} disabled={loading}>
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <Box sx={styles.infoRow}>
          <strong>Name:</strong>
          {editing ? (
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              style={styles.input}
              disabled={loading}
            />
          ) : (
            profile.name
          )}
        </Box>

        <Box sx={styles.infoRow}>
          <strong>Email:</strong> {profile.email}
        </Box>

        <Box sx={styles.infoRow}>
          <strong>Gender:</strong>
          {editing ? (
            <select name="sex" value={profile.sex} onChange={handleChange} style={styles.input} disabled={loading}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            profile.sex
          )}
        </Box>

        <Box sx={styles.infoRow}>
          <strong>Region:</strong>
          {editing ? (
            <input
              name="region"
              value={profile.region}
              onChange={handleChange}
              style={styles.input}
              disabled={loading}
            />
          ) : (
            profile.region
          )}
        </Box>

        {editing && (
          <Box sx={{ textAlign: 'right', mt: 2 }}>
            <button onClick={handleSave} style={styles.saveBtn} disabled={loading}>
              Save
            </button>
          </Box>
        )}

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            disabled={loading}
            sx={{
              borderRadius: 2,
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
      </div>
    </Layout>
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
    position: 'relative',
  },
  avatarRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem',
    gap: '1rem',
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
