// frontend/src/components/Dashboard.js
import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Tabs, Tab, Box, Typography } from '@mui/material';
import UserProfile from './UserProfile';

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
        <Tabs value={value} onChange={handleChange} aria-label="dashboard tabs">
          <Tab label="Home" />
          <Tab label="Check-Ins" />
          <Tab label="Profile" />
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
    </div>
  );
};

export default Dashboard;