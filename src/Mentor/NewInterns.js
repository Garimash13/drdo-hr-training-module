import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './NewInterns.css';

function NewInterns() {
  const [interns, setInterns] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [suggestedMentorId, setSuggestedMentorId] = useState('');
  const [showAcceptPopup, setShowAcceptPopup] = useState(false);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const mentorId = localStorage.getItem('mentorId');

  // Fetch interns with "Mentor Assigned"
  const fetchInterns = useCallback(() => {
    if (!mentorId) return;
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/mentors/${mentorId}/interns?status=Mentor Assigned`)
      .then(res => setInterns(res.data))
      .catch(err => console.error('❌ Error fetching interns', err))
      .finally(() => setLoading(false));
  }, [mentorId]);

  const fetchMentors = useCallback(() => {
    axios
      .get('http://localhost:8080/api/mentors')
      .then(res => setMentors(res.data))
      .catch(err => console.error('❌ Error fetching mentors', err));
  }, []);

  useEffect(() => {
    fetchInterns();
    fetchMentors();
  }, [fetchInterns, fetchMentors]);

  // Accept Intern
  const handleAcceptConfirm = () => {
    if (!projectName.trim() || !duration.trim() || !startDate) {
      alert('Please fill all fields.');
      return;
    }
    axios
      .put(
        `http://localhost:8080/api/mentors/${mentorId}/interns/${selectedIntern.id}/accept`,
        { projectName, duration, startDate },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then(() => {
        alert('✅ Intern accepted successfully.');
        fetchInterns();
        setShowAcceptPopup(false);
        setProjectName('');
        setDuration('');
        setStartDate('');
      })
      .catch(err => {
        console.error('❌ Failed to accept intern.', err);
        alert('Failed to accept intern.');
      });
  };

  // Reject Intern
  const handleRejectConfirm = () => {
    if (!remarks.trim()) {
      alert('Remarks are required.');
      return;
    }
    axios
      .put(
        `http://localhost:8080/api/mentors/${mentorId}/interns/${selectedIntern.id}/reject`,
        { remarks, suggestedMentorId: suggestedMentorId || null },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then(() => {
        alert('✅ Intern rejected successfully.');
        fetchInterns();
        setShowRejectPopup(false);
        setRemarks('');
        setSuggestedMentorId('');
      })
      .catch(err => {
        console.error('❌ Failed to reject intern.', err);
        alert('Failed to reject intern.');
      });
  };

  return (
    <div className="new-interns-section">
      <h2>New Interns</h2>

      {loading && <p>Loading interns...</p>}
      {!loading && interns.length === 0 && <p>No new interns assigned.</p>}

      {interns.map(intern => (
        <div className="intern-card" key={intern.id}>
          <p><strong>Name:</strong> {intern.name}</p>
          <p><strong>Email:</strong> {intern.email}</p>
          <p><strong>Education:</strong> {intern.education}</p>
          <p><strong>Branch:</strong> {intern.branch}</p>
          <button className="accept-btn" onClick={() => { setSelectedIntern(intern); setShowAcceptPopup(true); }}>
            Accept
          </button>
          <button className="reject-btn" onClick={() => { setSelectedIntern(intern); setShowRejectPopup(true); }}>
            Reject
          </button>
        </div>
      ))}

      {/* Accept Popup */}
      {showAcceptPopup && (
        <div className="popup-overlay">
          <div className="popup-card accept">
            <h3>Assign Project to {selectedIntern.name}</h3>
            <input type="text" placeholder="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
            <input type="text" placeholder="Duration (e.g., 3 Months)" value={duration} onChange={(e) => setDuration(e.target.value)} />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <div className="popup-actions">
              <button className="confirm-btn" onClick={handleAcceptConfirm}>Confirm</button>
              <button className="cancel-btn" onClick={() => setShowAcceptPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Popup */}
      {showRejectPopup && (
        <div className="popup-overlay">
          <div className="popup-card reject">
            <h3>Reject {selectedIntern.name}</h3>
            <textarea placeholder="Enter Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            <select value={suggestedMentorId} onChange={(e) => setSuggestedMentorId(e.target.value)}>
              <option value="">-- Suggest Another Mentor (Optional) --</option>
              {mentors.map(m => (
                m.id !== parseInt(mentorId) && <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <div className="popup-actions">
              <button className="confirm-btn reject-btn" onClick={handleRejectConfirm}>Reject</button>
              <button className="cancel-btn" onClick={() => setShowRejectPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewInterns;

