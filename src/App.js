import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Shared/Navbar'; 

import Home from './pages/Home';
import AdminLogin from './components/Login/AdminLogin';
import MentorLogin from './components/Login/MentorLogin';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import MentorDashboard from './components/Dashboard/MentorDashboard';

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/mentor-login" element={<MentorLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;

