import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignInPage from "./components/SignInPage";
import Dashboard from "./components/Dashboard";
import UserProfile from "./components/UserProfile";
import Trends from "./components/Trends";
import History from "./components/History";
// import Settings from "./components/Settings";
import CheckIn from "./components/CheckIn";
import MoodTrends from "./components/MoodTrends";
// import AIInsights from "./components/AIInsights"; // Uncomment if used
import ProtectedRoute from "./components/ProtectedRoute";
import { useStoreUserCookie } from "./hooks/useCurrentUser";
import { SnackbarProvider } from "./context/SnackbarContext";
import { setSnackbarHandler } from "./utils/axiosInstance";
import { useSnackbar } from "./context/SnackbarContext";

function App() {
  const { showSnackbar } = useSnackbar();
  useEffect(() => {
    setSnackbarHandler((message, severity) => {
      showSnackbar(message, severity);
    });
  }, [showSnackbar]);

  useStoreUserCookie();

  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/userprofile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkin"
        element={
          <ProtectedRoute>
            <CheckIn />
          </ProtectedRoute>
        }
      />
      {/* <Route path="/ai" element={<ProtectedRoute><AIInsights /></ProtectedRoute>} /> */}
      <Route
        path="/trends"
        element={
          <ProtectedRoute>
            <Trends />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mood"
        element={
          <ProtectedRoute>
            <MoodTrends />
          </ProtectedRoute>
        }
      />
      {/* <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} */}
    </Routes>
  );
}

function AppWrapper() {
  return (
    <SnackbarProvider>
      <Router>
        <App />
      </Router>
    </SnackbarProvider>
  );
}

export default AppWrapper;
