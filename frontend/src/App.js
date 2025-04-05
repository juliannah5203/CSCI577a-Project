// // frontend/src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// // import SignInPage from './components/SignInPage';
// import Dashboard from './components/Dashboard';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* <Route path="/" element={<SignInPage />} /> */}
//         <Route path="/" element={<Dashboard />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import AIInsights from './components/AIInsights';
import MoodTrends from './components/MoodTrends';
import CheckInHistory from './components/CheckInHistory';
import Settings from './components/Settings';
import CheckIn from './components/CheckIn';
function App() {
  return (
    <Router>
      <Routes>
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
