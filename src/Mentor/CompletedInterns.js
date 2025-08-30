import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./CompletedInterns.css";

function CompletedInterns() {
  const [completedInterns, setCompletedInterns] = useState([]);
  const [certifiedInterns, setCertifiedInterns] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [reportSubmitted, setReportSubmitted] = useState("");
  const [projectNameInput, setProjectNameInput] = useState("");
  const [completionDate, setCompletionDate] = useState("");

  const mentorId = localStorage.getItem("mentorId");

  // ✅ Fetch completed interns (no certificate yet)
  const fetchCompletedInterns = useCallback(() => {
    axios
      .get(
        `http://localhost:8080/api/mentors/${mentorId}/interns?status=Completed Internship`
      )
      .then((res) => setCompletedInterns(res.data))
      .catch((err) =>
        console.error("❌ Error fetching completed interns", err)
      );
  }, [mentorId]);

  // ✅ Fetch certified interns
  const fetchCertifiedInterns = useCallback(() => {
    axios
      .get(
        `http://localhost:8080/api/mentors/${mentorId}/interns?status=Certificate Issued`
      )
      .then((res) => setCertifiedInterns(res.data))
      .catch((err) =>
        console.error("❌ Error fetching certified interns", err)
      );
  }, [mentorId]);

  useEffect(() => {
    fetchCompletedInterns();
    fetchCertifiedInterns();
  }, [fetchCompletedInterns, fetchCertifiedInterns]);

  // ✅ Calculate default completion date
  const calculateCompletionDate = (startDate, duration) => {
    if (!startDate || !duration) return "";
    let date = new Date(startDate);
    const lower = duration.toLowerCase();
    const num = parseInt(duration.replace(/[^0-9]/g, ""), 10);

    if (lower.includes("week")) {
      date.setDate(date.getDate() + num * 7);
    } else if (lower.includes("month")) {
      date.setMonth(date.getMonth() + num);
    }
    return date.toISOString().split("T")[0];
  };

  const openPopup = (intern) => {
    setSelectedIntern(intern);
    setReportSubmitted("");
    setProjectNameInput("");
    setCompletionDate(
      calculateCompletionDate(intern.startDate, intern.duration)
    );
    setPopupOpen(true);
  };

  // ✅ Confirm completion date, report, and project
  const handleConfirm = () => {
    if (reportSubmitted === "yes" && projectNameInput.trim() !== "") {
      axios
        .put(
          `http://localhost:8080/api/mentors/${mentorId}/interns/${selectedIntern.id}/confirm-completion`,
          {
            completionDate,
            reportSubmitted: reportSubmitted === "yes",
            projectName: projectNameInput,
          },
          { headers: { "Content-Type": "application/json" } }
        )
        .then(() => {
          alert("✅ Completion confirmed!");
          fetchCompletedInterns();
          fetchCertifiedInterns();
        })
        .catch((err) => {
          console.error("❌ Failed to confirm completion", err);
          alert("Failed to confirm completion.");
        });
    }
    setPopupOpen(false);
    setSelectedIntern(null);
  };

  return (
    <div className="completed-interns-container">
      <h2>Internship Completed</h2>
      <div className="intern-list">
        {completedInterns.length === 0 ? (
          <p>No interns in this section.</p>
        ) : (
          completedInterns.map((intern) => (
            <div className="intern-card" key={intern.id}>
              <h3>{intern.name}</h3>
              <p>
                <strong>College:</strong> {intern.education}
              </p>
              <p>
                <strong>Branch:</strong> {intern.branch}
              </p>
              <p>
                <strong>Start Date:</strong> {intern.startDate}
              </p>
              <p>
                <strong>Duration:</strong> {intern.duration}
              </p>
              <button onClick={() => openPopup(intern)}>Project Report</button>
            </div>
          ))
        )}
      </div>

      <h2>Internship Completed and Issued Certificate</h2>
      <div className="intern-list">
        {certifiedInterns.length === 0 ? (
          <p>No certified interns yet.</p>
        ) : (
          certifiedInterns.map((intern) => (
            <div className="intern-card certified" key={intern.id}>
              <h3>{intern.name}</h3>
              <p>
                <strong>College:</strong> {intern.education}
              </p>
              <p>
                <strong>Branch:</strong> {intern.branch}
              </p>
              <p>
                <strong>Project:</strong> {intern.projectName}
              </p>
              <p>
                <strong>Status:</strong> Certificate Issued
              </p>
            </div>
          ))
        )}
      </div>

      {/* Popup */}
      {popupOpen && (
        <div className="popup-overlay">
          <div className="popup fancy-popup">
            <h3>Project Report Submission</h3>
            <p>Did the intern submit the project report?</p>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="yes"
                  checked={reportSubmitted === "yes"}
                  onChange={() => setReportSubmitted("yes")}
                />{" "}
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  value="no"
                  checked={reportSubmitted === "no"}
                  onChange={() => setReportSubmitted("no")}
                />{" "}
                No
              </label>
            </div>

            {reportSubmitted === "yes" && (
              <>
                <input
                  type="text"
                  placeholder="Enter Project Name"
                  value={projectNameInput}
                  onChange={(e) => setProjectNameInput(e.target.value)}
                />
                <label>
                  <strong>Completion Date:</strong>
                </label>
                <input
                  type="date"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                />
              </>
            )}

            <div className="popup-buttons">
              <button className="confirm-btn" onClick={handleConfirm}>
                Confirm
              </button>
              <button
                className="cancel-btn"
                onClick={() => setPopupOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompletedInterns;


