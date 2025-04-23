// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Badge,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import Layout from '../components/Layout';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// axios 实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
  withCredentials: true,
});

// Emoji 映射
const moods = [
  { emoji: '😔', label: 'Sad',    color: '#9370DB' },
  { emoji: '😕', label: 'Worried',color: '#FFA07A' },
  { emoji: '😐', label: 'Neutral',color: '#8B4513' },
  { emoji: '🙂', label: 'Good',   color: '#4CAF50' },
  { emoji: '😄', label: 'Great',  color: '#4169E1' },
];


function formatWithSuffix(date) {
  const d = date.getDate();
  const m = date.toLocaleString('default', { month: 'long' });
  const y = date.getFullYear();
  const suffix = (n => {
    if (n >= 11 && n <= 13) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  })(d);
  return `${m} ${d}${suffix}, ${y}`;
}


const DashboardCard = ({ children, onClick, sx }) => (
  <Paper
    onClick={onClick}
    sx={{ width: '100%', p: 2, borderRadius: 4, cursor: 'pointer', transition: 'box-shadow 0.3s ease', boxShadow: '1px 1px 3px rgba(0,0,0,0.29)', '&:hover': { boxShadow: '4px 4px 5px rgba(0,0,0,0.46)' }, ...sx }}
  >
    {children}
  </Paper>
);
DashboardCard.propTypes = { children: PropTypes.node.isRequired, onClick: PropTypes.func, sx: PropTypes.object };


const TabSection = ({ needAlert, onClearAlert }) => {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, position: 'relative' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ flexGrow: 1 }}>Welcome back!</Typography>
      <Badge badgeContent={needAlert ? 1 : 0} color="error" sx={{ '& .MuiBadge-badge': { top: 5, right: 5 } }}>
        <IconButton onClick={() => needAlert && setOpen(true)} sx={{ bgcolor: 'grey.300', p: 1, borderRadius: '50%', '&:hover': { bgcolor: 'grey.400' } }}>
          <NotificationsIcon />
        </IconButton>
      </Badge>
      {open && (
        <Paper elevation={3} sx={{ position: 'absolute', top: -5, right: 50, p: 1, display: 'flex', alignItems: 'center', borderRadius: 4 }}>
          <Typography sx={{ mr: 1 }}>You missed one check-in!</Typography>
          <IconButton size="small" onClick={() => { setOpen(false); onClearAlert(); }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Paper>
      )}
    </Box>
  );
};
TabSection.propTypes = { needAlert: PropTypes.bool.isRequired, onClearAlert: PropTypes.func.isRequired };

// 主组件
const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [needAlert, setNeedAlert] = useState(false);
  const [checkins, setCheckins] = useState([]);
  const [moodAgg, setMoodAgg] = useState([]);

  // 计算过去 7 天范围和文本
  const today = new Date();
  const startDate = new Date(); startDate.setDate(today.getDate() - 6);
  const dateRangeText = `${formatWithSuffix(startDate)} ～ ${formatWithSuffix(today)}`;

  // 1. 获取当前用户 ID
  useEffect(() => {
    api.get('/api/users/profile')
      .then(res => setUserId(res.data.userId ?? res.data.id))
      .catch(console.error)
      .finally(() => setLoadingUser(false));
  }, []);

  // 2. userId 可用后并行拉取数据
  useEffect(() => {
    if (!userId) return;
    api.get('/api/alert')
      .then(res => setNeedAlert(res.data.need_alert))
      .catch(console.error);
    api.get(`/api/checkins/${userId}`)
      .then(res => setCheckins(res.data.filter(item => {
        const d = new Date(item.date);
        return d >= startDate && d <= today;
      })))
      .catch(console.error);
    api.get(`/api/mood-aggregation/${userId}`)
      .then(res => {
        const daily = res.data.dailyData || [];
        const counts = daily.reduce((acc, { averageScore, count }) => {
          const r = Math.round(averageScore);
          acc[r] = (acc[r] || 0) + count;
          return acc;
        }, {});
        setMoodAgg(Object.entries(counts).map(([r, c]) => {
          const m = moods[r-1] || {};
          return { name: m.label || `#${r}`, value: c, color: m.color || '#ccc' };
        }));
      })
      .catch(console.error);
  }, [userId]);

  if (loadingUser) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  // 今日打卡条目 & 饼图数据
  const todayEntry = checkins.find(e => new Date(e.date).toDateString() === today.toDateString());
  const total = moodAgg.reduce((sum, e) => sum + e.value, 0);
  const noData = total === 0;
  const chartData = noData
    ? moods.map(m => ({ name: m.label, value: 1, color: m.color }))
    : moodAgg;
  const innerRadius = noData ? 80 * 0.7 : 0;

  return (
    <Layout>
      <Box sx={{ maxWidth: { xs: '100%', md: '60vw' }, mx: { xs: 0, md: 'auto' }, px: 2 }}>
        <TabSection needAlert={needAlert} onClearAlert={() => setNeedAlert(false)} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4 }}>

          {/* 左：Check-In & Mood Trends */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <DashboardCard onClick={() => navigate('/checkin')}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                Check-in{' '}{(!todayEntry) && <Typography component="span" color="error" fontWeight="bold">1</Typography>}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                {formatWithSuffix(today)}
              </Typography>
              {todayEntry && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  {moods.map((m, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: {xs: '40px', md:'50px'}, height: {xs: '40px', md:'50px'},
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        bgcolor: 'white', borderRadius: '50%', cursor: 'pointer', fontSize: {xs:'2rem',md:'2.5rem'}, paddingTop: 0.5,
                        border: todayEntry.moodRating === i + 1 ? `3px solid ${m.color}` : 'none',
                        boxShadow: todayEntry.moodRating === i + 1 ? `0 0 10px ${m.color}40` : 'none',
                      }}
                    >
                      {m.emoji}
                    </Box>
                  ))}
                </Box>
              )}
              <Typography>
                { todayEntry ? (todayEntry.note ? todayEntry.note : null) : "Waiting for today's check-in information..." }
              </Typography>
            </DashboardCard>

            <DashboardCard onClick={() => navigate('/trends')}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                Mood Trends
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                {dateRangeText}
              </Typography>
              {/* responsive legend + chart container */}
              <Box sx={{ width:'100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2 }}>
                <Box sx={{justifyContent:'left'}}>
                  {chartData.map((entry, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, backgroundColor: entry.color, mr: 1, borderRadius: 0.5, textAlign: 'left' }} />
                      <Typography sx={{ fontSize: '0.75rem' }}>
                        {entry.name}{!noData && ` (${Math.round((entry.value / total) * 100)}%)`}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                {/* Pie Chart */}
                <Box sx={{ position: 'relative', width: 200, height: 200, alignItems: 'center', justifyContent:'center', mx: 'auto', }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} dataKey="value" outerRadius={80} innerRadius={innerRadius} labelLine={false}>
                        {chartData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {noData && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%', left: '50%',
                        width: `${innerRadius * 2}px`,
                        height: `${innerRadius * 2}px`,
                        transform: 'translate(-50%, -50%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        textAlign: 'center',
                        pointerEvents: 'none',
                      }}
                    >
                      <Typography variant="body2" color="textSecondary">
                        Waiting for more information...
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </DashboardCard>
          </Box>

          {/* 右：History */}
          <Box sx={{ flex: 1 }}>
            <DashboardCard onClick={() => navigate('/history')}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                History
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                {dateRangeText}
              </Typography>
              {checkins.map((e, i) => (
                <Box key={i} sx={{ mb: 1, p: 1, bgcolor: '#fafafa', borderRadius: 2 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold', mb: 0.5 }}>
                    {formatWithSuffix(new Date(e.date))}
                  </Typography>
                  <Typography sx={{ fontSize: '1.25rem', mt: 0.5 }}>
                    {moods[e.moodRating - 1].emoji}
                  </Typography>
                  {e.note && (
                    <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                      {e.note}
                    </Typography>
                  )}
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
