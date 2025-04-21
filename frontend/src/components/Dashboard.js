// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Badge,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import Layout from '../components/Layout';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Emoji mapping
const moods = [
  { emoji: '😔', label: 'Sad',    color: '#9370DB' },
  { emoji: '😕', label: 'Worried',color: '#FFA07A' },
  { emoji: '😐', label: 'Neutral',color: '#8B4513' },
  { emoji: '🙂', label: 'Good',   color: '#4CAF50' },
  { emoji: '😄', label: 'Great',  color: '#4169E1' },
];

// Sample entries for the week
const sampleWeekEntries = [
  { date: 'April 18, 2025', moodRating: 1, note: 'Feeling awesome!' },
  { date: 'April 17, 2025', moodRating: 4, note: '' },
  { date: 'April 16, 2025', moodRating: 3, note: 'It was okay.' },
  { date: 'April 15, 2025', moodRating: 2, note: 'A bit down today.' },
  { date: 'April 14, 2025', moodRating: 5, note: 'Great day!' },
  { date: 'April 13, 2025', moodRating: 4, note: '' },
  { date: 'April 12, 2025', moodRating: 1, note: 'Rough morning.' },
];

// Aggregate for pie chart
const sampleAggregated = moods.map((m, idx) => ({
  name: m.label,
  value: sampleWeekEntries.filter(e => e.moodRating === idx + 1).length,
  color: m.color,
}));

// Reusable Card Component
const DashboardCard = ({ children, onClick, sx }) => (
  <Paper
    onClick={onClick}
    sx={{
      width: '100%',
      p: 2,
      borderRadius: 4,
      cursor: 'pointer',
      transition: 'box-shadow 0.3s ease',
      boxShadow: '1px 1px 3px rgba(0,0,0,0.29)',
      '&:hover': { boxShadow: '4px 4px 8px rgba(0,0,0,0.46)' },
      ...sx,
    }}
  >
    {children}
  </Paper>
);
DashboardCard.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  sx: PropTypes.object,
};

// Notification Tab Section
const TabSection = ({ needAlert, onClearAlert }) => {
  const [showMessage, setShowMessage] = useState(false);
  const handleIconClick = () => needAlert && setShowMessage(true);
  const handleClose = () => { setShowMessage(false); onClearAlert(); };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, position: 'relative' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ flexGrow: 1 }}>
        Welcome back!
      </Typography>
      <Badge badgeContent={needAlert ? 1 : 0} color="error">
        <IconButton onClick={handleIconClick} sx={{ bgcolor: 'grey.300', p: 1, borderRadius: '50%', '&:hover': { bgcolor: 'grey.400' } }}>
          <NotificationsIcon />
        </IconButton>
      </Badge>
      {showMessage && (
        <Paper elevation={3} sx={{ position: 'absolute', top: 56, right: 16, p: 1, display: 'flex', alignItems: 'center', borderRadius: 4 }}>
          <Typography sx={{ mr: 1 }}>You missed one check-in!</Typography>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Paper>
      )}
    </Box>
  );
};
TabSection.propTypes = {
  needAlert: PropTypes.bool.isRequired,
  onClearAlert: PropTypes.func.isRequired,
};

// Dashboard Page
const Dashboard = () => {
  const navigate = useNavigate();
  const [needAlert, setNeedAlert] = useState(false);
  const todayEntry = sampleWeekEntries[0];

  useEffect(() => {
    axios.get('/api/alert', { withCredentials: true })
      .then(res => setNeedAlert(res.data.need_alert))
      .catch(err => console.error(err));
  }, []);

  const handleClearAlert = () => setNeedAlert(false);
  const totalCheckins = sampleAggregated.reduce((sum, e) => sum + e.value, 0);

  return (
    <Layout>
      <Box sx={{ maxWidth: { xs: '100%', md: '60vw' }, mx: { xs: 0, md: 'auto' }, px: 2 }}>
        <TabSection needAlert={needAlert} onClearAlert={handleClearAlert} />

        {/* Two-column flex layout */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 4 }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <DashboardCard onClick={() => navigate('/checkin')}>
  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
    Check-In {needAlert && <Typography component="span" color="error" fontWeight="bold">1</Typography>}
  </Typography>
  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
    {moods.map((m, i) => (
      <Box
        key={i}
        onClick={() => {/* handle click */}}
        sx={{
          width: '50px',
          height: '50px',
          display: 'center',
          alignItems: 'center',   // push emoji downward
          justifyContent: 'center',
          paddingTop: '3px',                // padding-bottom shorthand
          bgcolor: 'white',
          borderRadius: '25px',
          cursor: 'pointer',
          border: todayEntry.moodRating === i + 1 ? `3px solid ${m.color}` : 'none',
          boxShadow: todayEntry.moodRating === i + 1 ? `0 0 10px ${m.color}40` : 'none',
          transition: 'all 0.2s ease',
          fontSize: '3.2rem',
          '&:hover': { transform: 'scale(1.1)' },
        }}
      >
        {m.emoji}
      </Box>
    ))}
  </Box>
  <Typography>
    {todayEntry.note || "Waiting for today's check-in information."}
  </Typography>
</DashboardCard>

            <DashboardCard onClick={() => navigate('/mood')}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                Mood Trends
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flexShrink: 0 }}>
                  {sampleAggregated.map((entry, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, backgroundColor: entry.color, mr: 1, borderRadius: 0.5 }} />
                      <Typography sx={{ fontSize: '0.75rem' }}>{entry.name} ({totalCheckins ? ((entry.value/totalCheckins)*100).toFixed(0) : 0}%)</Typography>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ flexShrink: 0, width: 200, height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={sampleAggregated} dataKey="value" outerRadius={80} innerRadius={0} labelLine={false}>
                        {sampleAggregated.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            </DashboardCard>
          </Box>
          <Box sx={{ flex: 1 }}>
            <DashboardCard onClick={() => navigate('/history')}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                History
              </Typography>
              {sampleWeekEntries.map((e, i) => (
                <Box key={i} sx={{ mb: 1, p: 1, backgroundColor: '#fafafa', borderRadius: 2 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold', mb: 0.5 }}>{e.date}</Typography>
                  <Typography sx={{ fontSize: '1.25rem', mt: 0.5 }}>{moods[e.moodRating-1].emoji}</Typography>
                  {e.note && <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>{e.note}</Typography>}
                </Box>
              ))}
            </DashboardCard>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

Dashboard.propTypes = {};
export default Dashboard;
