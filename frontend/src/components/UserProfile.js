// frontend/src/components/UserProfile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    region: '',
    sex: '',
    profilePicture: '',
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    axios.get('/api/users/profile', { withCredentials: true })
      .then(res => {
        const data = res.data;
        setProfile({
          name: data.name || '',
          email: data.email || '',
          region: data.region || '',
          sex: data.sex || '',
          profilePicture: data.profilePicture || '',
        });
      })
      .catch(err => console.error('Failed to fetch profile:', err));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const { name, region, sex } = profile;
    axios.put('/api/users/profile', { name, region, sex }, { withCredentials: true })
      .then(() => setEditing(false))
      .catch(err => console.error('Update failed:', err));
  };

  return (
    <div style={styles.profileCard}>
      <div style={styles.avatarRow}>
        <img src={profile.profilePicture || '/default-avatar.png'} alt="avatar" style={styles.avatar} />
        <div style={{ flex: 1 }}>
          <h2>{profile.name}</h2>
        </div>
        <button onClick={() => setEditing(!editing)} style={styles.editBtn}>
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div style={styles.infoRow}><strong>Name:</strong>
        {editing ? <input name="name" value={profile.name} onChange={handleChange} style={styles.input} /> : profile.name}
      </div>

      <div style={styles.infoRow}><strong>Email:</strong> {profile.email}</div>

      <div style={styles.infoRow}><strong>Gender:</strong>
        {editing ? (
          <select name="sex" value={profile.sex} onChange={handleChange} style={styles.input}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        ) : profile.sex}
      </div>

      <div style={styles.infoRow}><strong>Region:</strong>
        {editing ? <input name="region" value={profile.region} onChange={handleChange} style={styles.input} /> : profile.region}
      </div>

      {editing && (
        <div style={{ textAlign: 'right' }}>
          <button onClick={handleSave} style={styles.saveBtn}>Save</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  profileCard: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: '0 auto',
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
  }
};

export default UserProfile;