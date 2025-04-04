// frontend/src/components/Dashboard.js
import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Tabs, Tab, Box, Typography } from '@mui/material';
import UserProfile from './UserProfile';
import AIInsights from './AIInsights';
import MoodTrends from './MoodTrends';
import CheckInHistory from './CheckInHistory';
import Settings from './Settings';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

const Dashboard = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => setValue(newValue);

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: '#e6f4df', color: 'black' }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="dashboard tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Home" />
          <Tab label="Check-Ins" />
          <Tab label="Profile" />
          <Tab label="AI Insights" />
          <Tab label="Mood Trends" />
          <Tab label="Check-In History" />
          <Tab label="Settings" />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <Typography>Welcome to MindCare!</Typography>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography>Check-in tab (coming soon)</Typography>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <UserProfile />
      </TabPanel>
      <TabPanel value={value} index={0}>
        <AIInsights />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MoodTrends />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CheckInHistory />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Settings />
      </TabPanel>
    </div>
  );
};

export default Dashboard;