import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignInPage from "./components/SignInPage";
import Dashboard from "./components/Dashboard";
import UserProfile from "./components/UserProfile";
import Trends from "./components/Trends";
import History from "./components/History";
import Settings from "./components/Settings";
import CheckIn from "./components/CheckIn";
import ProtectedRoute from "./components/ProtectedRoute";
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

  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/userprofile" element={<UserProfile />} />
      <Route path="/checkin" element={<CheckIn />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/trends" element={<Trends />} />
      <Route path="/history" element={<History />} />
      <Route path="/settings" element={<Settings />} />
      <Route
        path="/placeHolderRoute"
        element={<ProtectedRoute></ProtectedRoute>}
      />
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
