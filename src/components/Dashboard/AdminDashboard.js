import React, { useState } from 'react';
import AddInternForm from '../Intern/AddInternForm';
import AssignMentorForm from '../../Mentor/AssignMentorForm';
import RejectedInterns from '../Intern/RejectedInterns';
import OngoingInterns from '../Admin/OngoingInterns';
import CompletedInternships from './CompletedInternships'; 
import IssuedCertificates from './IssuedCertificates';


import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('addIntern');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'addIntern':
        return <AddInternForm />;
      case 'assignMentor':
        return <AssignMentorForm />;
      case 'rejected':
        return <RejectedInterns />;
      case 'ongoing':
        return <OngoingInterns />;
      case 'completed':
        return <CompletedInternships />; 
      case 'issued':
         return <IssuedCertificates />;
      default:
        return <h3>Select a tab</h3>;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard">
        <div className="sidebar">
          <h2>Admin Dashboard</h2>
          <ul>
            <li onClick={() => setActiveTab('addIntern')}>Add New Intern</li>
            <li onClick={() => setActiveTab('assignMentor')}>Assign Mentor</li>
            <li onClick={() => setActiveTab('rejected')}>Rejected by Mentor</li>
            <li onClick={() => setActiveTab('ongoing')}>Ongoing Internships</li>
            <li onClick={() => setActiveTab('completed')}>Completed Internship</li>
            <li onClick={() => setActiveTab('issued')}>Issued Certificate</li>
          </ul>
        </div>
        <div className="content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;



