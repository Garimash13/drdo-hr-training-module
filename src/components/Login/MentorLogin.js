import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MentorLogin.css';

function MentorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/login/mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const mentor = await response.json();
        if (mentor && mentor.id) {
          // ✅ Save mentor info to localStorage
          localStorage.setItem('mentorId', mentor.id);
          localStorage.setItem('mentorName', mentor.name);

          // Redirect to dashboard
          navigate('/mentor-dashboard');
        } else {
          setError('Invalid email or password');
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Mentor Login</h2>

        {error && <p className="error-msg">{error}</p>}

        <label>Email:</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default MentorLogin;
