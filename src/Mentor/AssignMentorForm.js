import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AssignMentorForm.css';

function AssignMentorForm() {
  const [interns, setInterns] = useState([]);
  const [mentorsMap, setMentorsMap] = useState({});
  const [assignments, setAssignments] = useState({});
  const [selectedIntern, setSelectedIntern] = useState(null);

  // ✅ Fetch interns needing assignment
  const fetchInterns = () => {
    axios.get('http://localhost:8080/api/interns')
      .then(response => {
        const pendingInterns = response.data.filter(intern =>
          (!intern.mentorId || intern.mentorId === null) &&
          (intern.status === 'New Intern' || intern.status === 'Rejected')
        );
        setInterns(pendingInterns);

        // Fetch mentors list for each intern
        pendingInterns.forEach(intern => {
          if (intern.status === 'Rejected') {
            // Backend will exclude rejecting mentor automatically
            axios.get(`http://localhost:8080/api/mentors/available-mentors/${intern.id}`)
              .then(res => {
                setMentorsMap(prev => ({ ...prev, [intern.id]: res.data }));
              })
              .catch(err => console.error(`❌ Error fetching available mentors for intern ${intern.id}`, err));
          } else {
            // Fetch all mentors
            axios.get('http://localhost:8080/api/mentors')
              .then(res => {
                setMentorsMap(prev => ({ ...prev, [intern.id]: res.data }));
              })
              .catch(err => console.error('❌ Error fetching mentors:', err));
          }
        });
      })
      .catch(error => console.error('❌ Error fetching interns:', error));
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  // ✅ Handle mentor selection
  const handleAssignChange = (internId, mentorIdValue) => {
    const mentorId = Number(mentorIdValue);
    const selectedMentor = (mentorsMap[internId] || []).find(m => m.id === mentorId);
    const selectedInternObj = interns.find(i => i.id === internId);

    if (selectedMentor && selectedInternObj) {
      setAssignments(prev => ({
        ...prev,
        [internId]: {
          mentorId: selectedMentor.id,
          mentorName: selectedMentor.name,
          internName: selectedInternObj.name
        }
      }));
    }
  };

  // ✅ Submit mentor assignment
  const handleAssignSubmit = (internId) => {
    const assignment = assignments[internId];
    if (!assignment || !assignment.mentorId) {
      alert('Please select a mentor before submitting.');
      return;
    }

    axios.put(
      `http://localhost:8080/api/admin/interns/${internId}/assign-mentor`,
      assignment,
      { headers: { 'Content-Type': 'application/json' } }
    )
      .then((res) => {
        const saved = res.data;
        alert(`✅ Mentor "${assignment.mentorName}" assigned successfully!`);

        // Remove from local list
        setInterns(prev => prev.filter(intern => intern.id !== saved.id));

        // Remove from assignments map
        setAssignments(prev => {
          const newAssignments = { ...prev };
          delete newAssignments[internId];
          return newAssignments;
        });
      })
      .catch(error => {
        if (error.response) {
          console.error('❌ Error assigning mentor:', error.response);
          alert(`Failed to assign mentor: ${error.response.data}`);
        } else {
          console.error('❌ Error assigning mentor:', error);
          alert('Failed to assign mentor: Network or server error');
        }
      });
  };

  return (
    <div className="assign-mentor-container">
      <h2>Assign Mentor to Interns</h2>
      <table className="mentor-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Institute</th>
            <th>Branch</th>
            <th>Assign Mentor</th>
            <th>Submit</th>
            <th>View Details</th>
          </tr>
        </thead>
        <tbody>
          {interns.map((intern) => (
            <tr key={intern.id}>
              <td>{intern.name}</td>
              <td>{intern.email}</td>
              <td>{intern.education}</td>
              <td>{intern.branch}</td>
              <td>
                <select
                  value={assignments[intern.id]?.mentorId || ''}
                  onChange={(e) => handleAssignChange(intern.id, e.target.value)}
                >
                  <option value="">Select Mentor</option>
                  {(mentorsMap[intern.id] || []).length > 0 ? (
                    mentorsMap[intern.id].map((mentor) => (
                      <option key={mentor.id} value={mentor.id}>
                        {mentor.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No mentors available</option>
                  )}
                </select>
              </td>
              <td>
                <button onClick={() => handleAssignSubmit(intern.id)}>Submit</button>
              </td>
              <td>
                <button onClick={() => setSelectedIntern(intern)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔍 Intern Details Modal */}
      {selectedIntern && (
        <div className="details-modal">
          <div className="modal-content">
            <h3>Intern Details - {selectedIntern.name}</h3>
            <p><strong>Email:</strong> {selectedIntern.email}</p>
            <p><strong>Education:</strong> {selectedIntern.education}</p>
            <p><strong>Branch:</strong> {selectedIntern.branch}</p>
            <p><strong>Mobile:</strong> {selectedIntern.mobile}</p>
            <p><strong>Present Address:</strong> {selectedIntern.presentAddress}</p>
            <p><strong>Permanent Address:</strong> {selectedIntern.permanentAddress}</p>
            <p><strong>Status:</strong> {selectedIntern.status}</p>
            <button onClick={() => setSelectedIntern(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignMentorForm;




