/**
 * Authentication configuration
 */

module.exports = {
  // OAuth providers
  googleAuth: {
    scopes: ['profile', 'email'],
    callbackURL: '/auth/google/callback'
  },
  
  // Session settings
  session: {
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true
    },
    resave: false,
    saveUninitialized: false
  }
}; 