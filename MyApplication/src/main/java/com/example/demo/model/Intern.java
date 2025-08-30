package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "interns")
public class Intern {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Personal Info
    private String name;
    private String dob;
    private int age;
    private String presentAddress;
    private String permanentAddress;
    private String mobile;
    private String email;
    private String education; // College name
    private String branch;    // Department
    private String grades;
    private String foreignFamily;
    private String prevOrg;
    private String drdoExp;
    private String aadhar;

    // Photo
    @Column(name = "photo_path")
    private String photoPath;

    // Status & Mentor Info
    @Column(name = "status")
    private String status = "New Intern";

    @Column(name = "mentor_name")
    private String mentorName;

    @Column(name = "mentor_id")
    private Long mentorId;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "project_name")
    private String projectName;

    @Column(name = "rejected_by_mentor_id")
    private Long rejectedByMentorId;

    // Internship Tracking
    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "duration")
    private String duration;

    @Column(name = "completion_date")
    private LocalDate completionDate;

    @Column(name = "report_submitted")
    private Boolean reportSubmitted;

    // ----- Getters & Setters -----
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getPresentAddress() { return presentAddress; }
    public void setPresentAddress(String presentAddress) { this.presentAddress = presentAddress; }

    public String getPermanentAddress() { return permanentAddress; }
    public void setPermanentAddress(String permanentAddress) { this.permanentAddress = permanentAddress; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getGrades() { return grades; }
    public void setGrades(String grades) { this.grades = grades; }

    public String getForeignFamily() { return foreignFamily; }
    public void setForeignFamily(String foreignFamily) { this.foreignFamily = foreignFamily; }

    public String getPrevOrg() { return prevOrg; }
    public void setPrevOrg(String prevOrg) { this.prevOrg = prevOrg; }

    public String getDrdoExp() { return drdoExp; }
    public void setDrdoExp(String drdoExp) { this.drdoExp = drdoExp; }

    public String getAadhar() { return aadhar; }
    public void setAadhar(String aadhar) { this.aadhar = aadhar; }

    public String getPhotoPath() { return photoPath; }
    public void setPhotoPath(String photoPath) { this.photoPath = photoPath; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMentorName() { return mentorName; }
    public void setMentorName(String mentorName) { this.mentorName = mentorName; }

    public Long getMentorId() { return mentorId; }
    public void setMentorId(Long mentorId) { this.mentorId = mentorId; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public Long getRejectedByMentorId() { return rejectedByMentorId; }
    public void setRejectedByMentorId(Long rejectedByMentorId) { this.rejectedByMentorId = rejectedByMentorId; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public LocalDate getCompletionDate() { return completionDate; }
    public void setCompletionDate(LocalDate completionDate) { this.completionDate = completionDate; }

    public Boolean getReportSubmitted() { return reportSubmitted; }
    public void setReportSubmitted(Boolean reportSubmitted) { this.reportSubmitted = reportSubmitted; }
}


