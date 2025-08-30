# DRDO HR Training Module

A full-stack **HR Training & Internship Management System** developed for streamlining internship workflows, mentor allocation, feedback collection, and certification within research institutions.  
The system replaces manual Excel/paper-based processes with a secure, scalable, and user-friendly web application.

---

## 🚀 Features

### 🔹 Admin Module
- Secure login with JWT authentication.
- Dashboard with:
  - Add / Manage Interns.
  - Add / Manage Mentors.
  - Assign mentors to interns.
  - Internship status tracking (Not Started, Ongoing, Completed).
  - Certificate generation and issuance.
  - Reports (CSV/PDF export).

### 🔹 Mentor Module
- Login with role-based access.
- View assigned interns.
- Update internship status (progress, completed).
- Approve project reports.
- Mark interns eligible for certificate issuance.

### 🔹 Intern Module
- Online application submission.
- Upload documents and resume.
- View status of internship (Applied → Shortlisted → Allocated → Completed).
- Submit project reports.

---

## 🏗️ System Architecture

- **Frontend**: React.js, Bootstrap, JavaScript  
- **Backend**: Spring Boot (REST APIs)  
- **Database**: MySQL  
- **Authentication**: JWT (JSON Web Tokens)  
- **Deployment**: Local/Server using Apache Tomcat  

---

## 📂 Project Structure

drdo-hr-training-module/
│── backend/ # Spring Boot backend code
│ ├── src/main/java/ # Controllers, Services, Models, Repositories
│ └── src/main/resources
│
│── frontend/ # React frontend code
│ ├── src/components # UI Components
│ ├── src/pages # Dashboard, Login, Mentor Panel
│ └── public/ # Static files
│
│── database/

🔒 Security

Role-based access (Admin / Mentor / Intern).

Passwords securely hashed.

JWT tokens for session management.

📊 Outcomes

Digital transformation of internship workflows.

Transparent mentor-intern allocation.

Internship completion and certification streamlined.

Audit-ready reporting and data tracking.

📜 License

This project is developed for institutional and research purposes.
Distribution restricted — internal use only.
