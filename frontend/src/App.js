import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInPage from './components/SignInPage';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import AIInsights from './components/AIInsights';
import MoodTrends from './components/MoodTrends';
import CheckInHistory from './components/CheckInHistory';
import Settings from './components/Settings';
import CheckIn from './components/CheckIn';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<SignInPage />} /> 
        {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/userprofile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/checkin" element={<ProtectedRoute><CheckIn /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/ai" element={<ProtectedRoute><AIInsights /></ProtectedRoute>} />
        <Route path="/mood" element={<ProtectedRoute><MoodTrends /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><CheckInHistory /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} /> */}

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/ai" element={<AIInsights />} />
        <Route path="/mood" element={<MoodTrends />} />
        <Route path="/history" element={<CheckInHistory />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
