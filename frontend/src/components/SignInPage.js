// src/components/SignInPage.js
import React from 'react';

const SignInPage = () => {
  const handleSignIn = () => {
    // Redirect to your backend's Google OAuth endpoint
    window.location.href = '/auth/google';
  };

  // Inline styles for demonstration; you can also use CSS classes
  const containerStyle = {
    backgroundColor: 'black',
    color: 'white',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
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
    <div style={containerStyle}>
      <h1>Welcome</h1>
      <button style={buttonStyle} onClick={handleSignIn}>
        Sign in with Google
      </button>
    </div>
  );
};

export default SignInPage;
