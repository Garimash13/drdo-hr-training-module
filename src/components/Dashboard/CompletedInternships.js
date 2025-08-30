import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CompletedInternships.css";

function CompletedInternships() {
  const [interns, setInterns] = useState([]);

  useEffect(() => {
    fetchCompletedInterns();
  }, []);

  const fetchCompletedInterns = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/interns/all");

      // Map backend fields to frontend format
      const mappedData = response.data.map((intern) => ({
        id: intern.id,
        name: intern.name || "",
        email: intern.email || "",
        department: intern.branch || "",
        projectName: intern.projectName || "",
        mentor: intern.mentorName || "",
        status: intern.status || "",
      }));

      setInterns(mappedData);
    } catch (error) {
      console.error("❌ Error fetching interns:", error);
      setInterns([]); // fallback
    }
  };

  // ✅ Filter safely with case-insensitive check
  const submittedReports = interns.filter(
    (intern) => (intern.status || "").trim().toLowerCase() === "certificate issued"
  );
  const notSubmittedReports = interns.filter(
    (intern) => (intern.status || "").trim().toLowerCase() === "completed internship"
  );

  return (
    <div className="completed-internships">
      <h2>Completed Internships</h2>

      {/* ✅ Project Report Submitted */}
      <div className="internship-section">
        <h3 data-icon="✅"> Project Report Submitted</h3>
        <div className="intern-list">
          {submittedReports.length > 0 ? (
            submittedReports.map((intern) => (
              <div className="intern-card" key={intern.id}>
                <p><strong>Name:</strong> {intern.name}</p>
                <p><strong>Email:</strong> {intern.email}</p>
                <p><strong>Department:</strong> {intern.department}</p>
                <p><strong>Project Name:</strong> {intern.projectName}</p>
                <p><strong>Mentor:</strong> {intern.mentor}</p>
              </div>
            ))
          ) : (
            <p>No submissions yet.</p>
          )}
        </div>
      </div>

      {/* ❌ Project Report Not Submitted */}
      <div className="internship-section">
        <h3 data-icon="❌"> Project Report Not Submitted</h3>
        <div className="intern-list">
          {notSubmittedReports.length > 0 ? (
            notSubmittedReports.map((intern) => (
              <div className="intern-card" key={intern.id}>
                <p><strong>Name:</strong> {intern.name}</p>
                <p><strong>Email:</strong> {intern.email}</p>
                <p><strong>Department:</strong> {intern.department}</p>
                <p><strong>Project Name:</strong> {intern.projectName}</p>
                <p><strong>Mentor:</strong> {intern.mentor}</p>
              </div>
            ))
          ) : (
            <p>All reports submitted.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompletedInternships;
