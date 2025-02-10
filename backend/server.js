// backend/server.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Allow cross-origin requests from the React frontend (assumed to run on http://localhost:3000)
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Express session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Configure Passport with the Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    // TODO: Find or create a user in your MongoDB here
    // For this demo, we simply pass the profile object
    return done(null, profile);
  }
));

// Serialize and deserialize the user for session management
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Route to start the Google OAuth flow
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// OAuth callback URL
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login-failure', session: true }),
  (req, res) => {
    // Successful authentication, redirect to the React dashboard.
    res.redirect('http://localhost:3000/dashboard');
  }
);

// Logout route
app.get('/auth/logout', (req, res) => {
  req.logout(err => {
    if (err) { return next(err); }
    res.redirect('http://localhost:3000/');
  });
});

// Route to check the current logged-in user
app.get('/auth/current_user', (req, res) => {
  res.send(req.user);
});

// A simple failure route
app.get('/login-failure', (req, res) => {
  res.send('Failed to authenticate.');
});

// Start the server
const PORT = process.env.PORT || 5001;
// A simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running' });
});
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
