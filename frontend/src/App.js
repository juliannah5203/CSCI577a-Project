import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignInPage from "./components/SignInPage";
import Dashboard from "./components/Dashboard";
import UserProfile from "./components/UserProfile";
// import AIInsights from "./components/AIInsights";
import Trends from "./components/Trends";
import History from "./components/History";
import Settings from "./components/Settings";
import CheckIn from "./components/CheckIn";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/userprofile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/checkin" element={<ProtectedRoute><CheckIn /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        {/* <Route path="/ai" element={<ProtectedRoute><AIInsights /></ProtectedRoute>} /> */}
        <Route path="/trends" element={<ProtectedRoute><Trends /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
