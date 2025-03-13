// frontend/src/components/Dashboard.js
import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Tabs, Tab, Box, Typography } from '@mui/material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div 
      role="tabpanel" 
      hidden={value !== index} 
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
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
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="dashboard tabs">
          <Tab label="Tab One" />
          <Tab label="Tab Two" />
          <Tab label="Tab Three" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        Content for Tab One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Content for Tab Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Content for Tab Three
      </TabPanel>
    </div>
  );
};

export default Dashboard;
