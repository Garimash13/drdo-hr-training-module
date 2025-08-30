// components/Dashboard/MentorDashboard.js

import React, { useState } from 'react';

import NewInterns from '../../Mentor/NewInterns';
import OngoingInterns from '../../Mentor/OngoingInterns';
import CompletedInterns from '../../Mentor/CompletedInterns';

import './MentorDashboard.css';

function MentorDashboard() {
  const [activeTab, setActiveTab] = useState('new');

  const renderContent = () => {
    switch (activeTab) {
      case 'new':
        return <NewInterns />;
      case 'ongoing':
        return <OngoingInterns />;
      case 'completed':
        return <CompletedInterns />;
      default:
        return <h3>Select a tab</h3>;
    }
  };

  return (
    <div className="mentor-dashboard-container">
      <div className="mentor-dashboard">
        <div className="sidebar">
          <h2>Mentor Dashboard</h2>
          <ul>
            <li
              className={activeTab === 'new' ? 'active' : ''}
              onClick={() => setActiveTab('new')}
            >
              New Interns
            </li>
            <li
              className={activeTab === 'ongoing' ? 'active' : ''}
              onClick={() => setActiveTab('ongoing')}
            >
              Ongoing Internships
            </li>
            <li
              className={activeTab === 'completed' ? 'active' : ''}
              onClick={() => setActiveTab('completed')}
            >
              Completed Internships
            </li>
          </ul>
        </div>

        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default MentorDashboard;


