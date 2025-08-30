import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './RejectedInterns.css';

function RejectedInterns() {
  const [rejectedInterns, setRejectedInterns] = useState([]);

  // ✅ Fetch rejected interns without assigned mentor
  const fetchRejectedInterns = useCallback(() => {
    axios
      .get(`http://localhost:8080/api/admin/interns/rejected`)
      .then(res => setRejectedInterns(res.data))
      .catch(err => console.error('❌ Error fetching rejected interns', err));
  }, []);

  useEffect(() => {
    fetchRejectedInterns(); // initial load

    // ✅ Auto-refresh every 5 seconds
    const interval = setInterval(fetchRejectedInterns, 5000);
    return () => clearInterval(interval); // cleanup on unmount
  }, [fetchRejectedInterns]);

  return (
    <div>
      <h2>Rejected Interns</h2>
      <table className="rejected-table">
        <thead>
          <tr>
            <th>Intern Name</th>
            <th>Email</th>
            <th>Reason for Rejection</th>
          </tr>
        </thead>
        <tbody>
          {rejectedInterns.length === 0 ? (
            <tr>
              <td colSpan="3">No rejected interns at the moment.</td>
            </tr>
          ) : (
            rejectedInterns.map((intern) => (
              <tr key={intern.id}>
                <td>{intern.name}</td>
                <td>{intern.email}</td>
                <td>{intern.remarks || 'No reason provided'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RejectedInterns;
