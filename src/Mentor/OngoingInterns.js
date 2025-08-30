import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './OngoingInterns.css';

function OngoingInterns() {
  const [ongoingInterns, setOngoingInterns] = useState([]);
  const [loading, setLoading] = useState(false);

  const mentorId = localStorage.getItem('mentorId');

  // ✅ Fetch ongoing internships
  const fetchOngoingInterns = useCallback(() => {
    if (!mentorId) {
      console.error('❌ mentorId is missing! Cannot fetch ongoing interns.');
      return;
    }
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/mentors/${mentorId}/interns?status=Ongoing Internship`)
      .then(res => {
        setOngoingInterns(res.data);
      })
      .catch(err => {
        console.error('❌ Error fetching ongoing interns', err);
      })
      .finally(() => setLoading(false));
  }, [mentorId]);

  useEffect(() => {
    fetchOngoingInterns();
  }, [fetchOngoingInterns]);

  // ✅ Mark as Completed
  const handleMarkCompleted = (internId) => {
    axios
      .put(`http://localhost:8080/api/mentors/${mentorId}/interns/${internId}/complete`)
      .then(() => {
        alert('✅ Intern marked as Completed.');
        fetchOngoingInterns();
      })
      .catch(err => {
        console.error('❌ Failed to mark completed', err);
        alert('Failed to mark completed.');
      });
  };

  return (
    <div>
      <h2>Ongoing Internships</h2>

      {loading && <p>Loading ongoing internships...</p>}
      {!loading && ongoingInterns.length === 0 ? (
        <p>No ongoing internships at the moment.</p>
      ) : (
        <div className="intern-list">
          {ongoingInterns.map((intern) => (
            <div className="intern-card" key={intern.id}>
              <h3>{intern.name}</h3>
              <p><strong>ID:</strong> {intern.id}</p>
              <p><strong>College:</strong> {intern.education}</p>
              <p><strong>Branch:</strong> {intern.branch}</p>
              <p><strong>Email:</strong> {intern.email}</p>
              <p><strong>Project:</strong> {intern.projectName || 'Not Assigned'}</p>

              {/* ✅ New button */}
              <button
                className="complete-btn"
                onClick={() => handleMarkCompleted(intern.id)}
              >
                Mark as Completed
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OngoingInterns;
