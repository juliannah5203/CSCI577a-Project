// src/components/SignInPage.js
import React from 'react';
import { Box, Typography, CssBaseline, Button } from '@mui/material';

const HeaderSection = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        mb: 4,
        boxShadow: '0px 2px 7px rgba(0, 0, 0, 0.20)',
        transition: 'box-shadow 0.3s ease-in-out',
      }}
    >
      {/* Translucent full-width overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          width: '100vw',
          height: '100%',
          backgroundColor: 'rgb(255, 255, 254)',
          zIndex: 0,
        }}
      />
      {/* header content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          px: { xs: 3, md: 5 },
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          fontSize={30}
          sx={{ cursor: 'default' }}
        >
          MindCare
        </Typography>
      </Box>
    </Box>
  );
};

const SignInPage = () => {
  const handleSignIn = () => {
    window.location.href = 'http://localhost:5001/auth/google';
  };

  // const buttonStyle = {
  //   backgroundColor: 'white',
  //   color: 'black',
  //   border: 'none',
  //   padding: '12px 24px',
  //   fontSize: '18px',
  //   borderRadius: '4px',
  //   cursor: 'pointer',
  // };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: '#e6f4df',
          minHeight: '100vh',
          width: '100vw',
          overflowX: 'hidden',
          pt: 0,
          pb: 3,
          px: 0,
          position: 'relative',
        }}
      >
        <HeaderSection />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            px: 3,
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Welcome!
          </Typography>
          <Button
            onClick={handleSignIn}
            sx={{
              backgroundColor: 'white',
              color: 'black',
              padding: '12px 24px',
              fontSize: '18px',
              borderRadius: 4,
              cursor: 'pointer',
              transition: 'box-shadow 0.3s ease',
              boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.29)',
              '&:hover': {
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.46)',
                backgroundColor: 'white',
              },
              textTransform: 'none',
            }}
          >
            Sign in with Google
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default SignInPage;
