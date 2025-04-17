// src/components/SignInPage.js
import React from 'react';
import { Box, Typography } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

const HeaderSection = () => {
  // const navigate = useNavigate();
  
  return (
    <Box
      sx={{
        position: 'relative',
        mb: 4,
        minHeight: '80px', // 固定头部高度
        width: '100%',
      }}
    >
      {/* 透明覆盖层 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: -35,
          width: 'calc(100vw)',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          borderRadius: 3,
          zIndex: 0,
        }}
      />
      {/* Header 内容：左侧放置 MindCare 文本，垂直居中 */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          px: 0.25,
          py: 2.5,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          fontSize={36}
          // onClick={() => navigate('/dashboard')}
          sx={{ cursor: 'pointer', textAlign: 'left' }}
        >
          MindCare
        </Typography>
      </Box>
    </Box>
  );
};

const SignInPage = () => {
  const handleSignIn = () => {
    // 重定向到后端的 Google OAuth 端点
    window.location.href = 'http://localhost:5001/auth/google';
  };

  const buttonStyle = {
    backgroundColor: 'white',
    color: 'black',
    border: 'none',
    padding: '12px 24px',
    fontSize: '18px',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <Box
      sx={{
        backgroundColor: '#e6f4df', // 浅绿色背景
        minHeight: '100vh',
        position: 'relative',
        pt: 0,
        px: 3,
        pb: 3,
      }}
    >
      {/* 头部区域 */}
      <HeaderSection />

      {/* 中间区域：欢迎文字和登录按钮 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 80px)', // 扣除 header 高度
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Welcome
        </Typography>
        <button style={buttonStyle} onClick={handleSignIn}>
          Sign in with Google
        </button>
      </Box>
    </Box>
  );
};

export default SignInPage;
