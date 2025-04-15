import React, { useEffect, useState } from 'react';
// import React, {useState } from 'react';

import axios from 'axios';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
//   Avatar,
//   Menu,
//   MenuItem,
//   IconButton,
} from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';



HeaderSection.propTypes = {
  username: PropTypes.string
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
  const navigate = useNavigate();

  // Fetch user profile
  useEffect(() => {
    axios.get('http://localhost:5001/api/users/profile', { withCredentials: true })
      .then(res => {
        const data = res.data;
        const newProfile = {
          name: data.name || '',
          email: data.email || '',
          region: data.region || '',
          sex: data.sex || '',
          // profilePicture: data.profilePicture || '',
        };
        setProfile(newProfile);
        setOriginalProfile(newProfile);
      })
      .catch(err => {
        console.error('Failed to fetch profile:', err);
        // If profile fetching fails, redirect the user to the sign-in page.
        navigate('/');
      });
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Toggle edit mode. Save a backup before editing.
  const handleEditToggle = () => {
    if (!editing) {
      setOriginalProfile(profile);
    } else {
      setProfile(originalProfile);
    }
    setEditing(!editing);
  };

  // Update the profile via a PUT request.
  const handleSave = () => {
    const { name, region, sex } = profile;
    axios.put('http://localhost:5001/api/users/profile', { name, region, sex }, { withCredentials: true })
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

    <Layout>

      <div style={styles.profileCard}>
        <div style={styles.avatarRow}>
          <img
            src={profile.profilePicture || '/default-avatar.png'}
            alt="avatar"
            style={styles.avatar}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5">{profile.name}</Typography>
          </Box>
          <button onClick={handleEditToggle} style={styles.editBtn}>
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
        </Box>
        <Box sx={styles.infoRow}>
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
        </Box>
        {editing && (
          <Box sx={{ textAlign: 'right', mt: 2 }}>
            <button onClick={handleSave} style={styles.saveBtn}>
              Save
            </button>
          </Box>
        )}
       
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