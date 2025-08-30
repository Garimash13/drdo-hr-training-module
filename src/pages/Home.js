import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="overlay">
        <h1 className="title">DRDO HR Training Portal</h1>
        <div className="login-buttons">
          <button onClick={() => navigate('/admin-login')}>Admin Login</button>
          <button onClick={() => navigate('/mentor-login')}>Mentor Login</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
