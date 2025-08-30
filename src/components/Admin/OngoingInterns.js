import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OngoingInterns.css";

function OngoingInterns() {
  const [interns, setInterns] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterMentor, setFilterMentor] = useState("");
  const [selectedIntern, setSelectedIntern] = useState(null);

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/interns/ongoing");

      // ✅ Map backend fields to frontend and ensure filtering only "Ongoing Internship"
      const mappedData = response.data
        .filter((intern) => intern.status?.trim().toLowerCase() === "ongoing internship")
        .map((intern) => ({
          id: intern.id,
          name: intern.name || "",
          email: intern.email || "",
          contact: intern.mobile || "",
          college: intern.education || "",
          department: intern.branch || "",
          mentor: intern.mentorName || "",
          project: intern.projectName || "",
          startDate: intern.startDate || "",
          duration: intern.duration || "",
        }));

      setInterns(mappedData);
    } catch (error) {
      console.error("❌ Error fetching ongoing interns:", error);
      setInterns([]);
    }
  };

  const filteredInterns = interns.filter((intern) => {
    return (
      intern.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterDept === "" || intern.department === filterDept) &&
      (filterMentor === "" || intern.mentor === filterMentor)
    );
  });

  return (
    <div className="ongoing-interns-container">
      <h2>Ongoing Internships</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
          <option value="">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="ME">ME</option>
        </select>
        <select value={filterMentor} onChange={(e) => setFilterMentor(e.target.value)}>
          <option value="">All Mentors</option>
          {[...new Set(interns.map((intern) => intern.mentor).filter(Boolean))].map((mentor) => (
            <option key={mentor} value={mentor}>
              {mentor}
            </option>
          ))}
        </select>
      </div>

      <table className="interns-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>College</th>
            <th>Department</th>
            <th>Mentor</th>
            <th>Project</th>
            <th>Start Date</th>
            <th>Duration</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredInterns.length === 0 ? (
            <tr>
              <td colSpan="10">No ongoing internships found.</td>
            </tr>
          ) : (
            filteredInterns.map((intern) => (
              <tr key={intern.id}>
                <td>{intern.name}</td>
                <td>{intern.email}</td>
                <td>{intern.contact}</td>
                <td>{intern.college}</td>
                <td>{intern.department}</td>
                <td>{intern.mentor}</td>
                <td>{intern.project}</td>
                <td>{intern.startDate}</td>
                <td>{intern.duration}</td>
                <td>
                  <button className="view-btn" onClick={() => setSelectedIntern(intern)}>
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedIntern && (
        <div className="popup-overlay" onClick={() => setSelectedIntern(null)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <h3>Intern Details</h3>
            <p><strong>Name:</strong> {selectedIntern.name}</p>
            <p><strong>Email:</strong> {selectedIntern.email}</p>
            <p><strong>Contact:</strong> {selectedIntern.contact}</p>
            <p><strong>College:</strong> {selectedIntern.college}</p>
            <p><strong>Department:</strong> {selectedIntern.department}</p>
            <p><strong>Mentor:</strong> {selectedIntern.mentor}</p>
            <p><strong>Project:</strong> {selectedIntern.project}</p>
            <p><strong>Start Date:</strong> {selectedIntern.startDate}</p>
            <p><strong>Duration:</strong> {selectedIntern.duration}</p>
            <button onClick={() => setSelectedIntern(null)} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OngoingInterns;

