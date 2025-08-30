import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./IssuedCertificates.css";

const IssuedCertificates = () => {
  const [issued, setIssued] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString("en-GB"); // dd/MM/yyyy
  };

  const fetchIssuedCertificates = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/interns/all");
      const issuedData = res.data
        .filter(
          (intern) =>
            (intern.status || "").trim().toLowerCase() === "certificate issued"
        )
        .map((intern) => ({
          id: intern.id,
          name: intern.name || "",
          email: intern.email || "",
          mentor: intern.mentorName || "",
          project: intern.projectName || "",
          completionDate: formatDate(intern.completionDate) || "",
        }));
      setIssued(issuedData);
    } catch (err) {
      console.error("❌ Error fetching issued certificates:", err);
    }
  }, []);

  useEffect(() => {
    fetchIssuedCertificates();
  }, [fetchIssuedCertificates]); // ✅ No more missing dependency warning

  return (
    <div className="issued-certificates-container">
      <h2 className="page-title">🏆 Issued Certificates</h2>
      <div className="cert-grid">
        {issued.length > 0 ? (
          issued.map((intern) => (
            <div key={intern.id} className="cert-card">
              <div className="cert-header">
                <span className="cert-icon">🎓</span>
                <h3>{intern.name}</h3>
              </div>
              <p><strong>Email:</strong> {intern.email}</p>
              <p><strong>Mentor:</strong> {intern.mentor}</p>
              <p><strong>Project:</strong> {intern.project}</p>
              <p className="cert-date">📅 {intern.completionDate}</p>
            </div>
          ))
        ) : (
          <p className="no-data">No certificates issued yet.</p>
        )}
      </div>
    </div>
  );
};

export default IssuedCertificates;


