// backend/server.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const mongoose = require('mongoose');
const authController = require('./controllers/authController');
const authConfig = require('./config/auth');
require('dotenv').config();

const app = express();

app.use(express.json());

// Allow cross-origin requests from the React frontend (assumed to run on http://localhost:3000)
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Express session middleware using config settings
app.use(session(authConfig.session));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// router
const Api = require('./routes/Api');
app.use('', Api);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Configure Passport with the Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: authConfig.googleAuth.callbackURL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user in database
      const user = await authController.findOrCreateGoogleUser(profile);
      return done(null, { id: user.google_id, userId: user._id });
    } catch (err) {
      console.error("Error in Google authentication strategy:", err);
      return done(err, null);
    }
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
  passport.authenticate('google', { scope: authConfig.googleAuth.scopes })
);

// OAuth callback URL
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login-failure', session: true }),
  (req, res) => {
    // Successful authentication, redirect to the React dashboard.
    const clientBaseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-production-url.com' 
      : 'http://localhost:3000';
    res.redirect(`${clientBaseUrl}/dashboard`);
  }
);

// Logout route
app.get('/auth/logout', (req, res,next) => {
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

// A simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Start the server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
