package com.example.demo.controller;

import com.example.demo.model.Intern;
import com.example.demo.repository.InternRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@RestController
@RequestMapping("/api/interns")
@CrossOrigin(origins = "http://localhost:3000")
public class InternController {

    @Autowired
    private InternRepository internRepository;

    private static final String IMAGE_DIRECTORY = "images";

    // 1. Add Intern
    @PostMapping("/add")
    public Intern addIntern(
            @RequestParam("name") String name,
            @RequestParam("dob") String dob,
            @RequestParam("age") int age,
            @RequestParam("presentAddress") String presentAddress,
            @RequestParam("permanentAddress") String permanentAddress,
            @RequestParam("mobile") String mobile,
            @RequestParam("email") String email,
            @RequestParam("education") String education,
            @RequestParam("branch") String branch,
            @RequestParam("grades") String grades,
            @RequestParam("foreignFamily") String foreignFamily,
            @RequestParam("prevOrg") String prevOrg,
            @RequestParam("drdoExp") String drdoExp,
            @RequestParam("aadhar") String aadhar,
            @RequestParam(value = "photo", required = false) MultipartFile photo
    ) throws IOException {

        Intern intern = new Intern();
        intern.setName(name);
        intern.setDob(dob);
        intern.setAge(age);
        intern.setPresentAddress(presentAddress);
        intern.setPermanentAddress(permanentAddress);
        intern.setMobile(mobile);
        intern.setEmail(email);
        intern.setEducation(education);
        intern.setBranch(branch);
        intern.setGrades(grades);
        intern.setForeignFamily(foreignFamily);
        intern.setPrevOrg(prevOrg);
        intern.setDrdoExp(drdoExp);
        intern.setAadhar(aadhar);
        intern.setStatus("New Intern");

        if (photo != null && !photo.isEmpty()) {
            File uploadDir = new File(IMAGE_DIRECTORY);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            String fileName = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
            Path filePath = Paths.get(IMAGE_DIRECTORY, fileName);
            Files.copy(photo.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            intern.setPhotoPath("/" + IMAGE_DIRECTORY + "/" + fileName);
        }

        return internRepository.save(intern);
    }

    // 2. Get All Interns
    @GetMapping
    public List<Intern> getAllInterns() {
        return internRepository.findAll();
    }

    // 3. Accept Intern (Mentor)
    @PutMapping("/{id}/accept")
    public Intern acceptIntern(@PathVariable Long id, @RequestBody AcceptRequest body) {
        Intern intern = internRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intern not found with ID: " + id));

        intern.setProjectName(body.getProjectName());
        intern.setStatus("Ongoing Internship");
        return internRepository.save(intern);
    }

    public static class AcceptRequest {
        private String projectName;
        public String getProjectName() { return projectName; }
        public void setProjectName(String projectName) { this.projectName = projectName; }
    }

    // 4. Reject Intern (Mentor)
    @PutMapping("/{id}/reject")
    public Intern rejectIntern(@PathVariable Long id, @RequestBody RejectRequest body) {
        Intern intern = internRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intern not found with ID: " + id));

        intern.setRemarks(body.getRemarks());

        if (body.getNewMentorId() != null && body.getNewMentorName() != null) {
            intern.setMentorId(body.getNewMentorId());
            intern.setMentorName(body.getNewMentorName());
            intern.setStatus("Mentor Assigned");
        } else {
            intern.setMentorId(null);
            intern.setMentorName(null);
            intern.setStatus("New Intern");
        }

        return internRepository.save(intern);
    }

    public static class RejectRequest {
        private String remarks;
        private Long newMentorId;
        private String newMentorName;
        public String getRemarks() { return remarks; }
        public void setRemarks(String remarks) { this.remarks = remarks; }
        public Long getNewMentorId() { return newMentorId; }
        public void setNewMentorId(Long newMentorId) { this.newMentorId = newMentorId; }
        public String getNewMentorName() { return newMentorName; }
        public void setNewMentorName(String newMentorName) { this.newMentorName = newMentorName; }
    }

    // 5. Mark as Completed
    @PutMapping("/{id}/complete")
    public Intern markInternAsCompleted(@PathVariable Long id, @RequestParam boolean projectReportSubmitted) {
        Intern intern = internRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intern not found with ID: " + id));

        if (projectReportSubmitted) {
            intern.setStatus("Completed Internship");
        } else {
            intern.setStatus("Internship Completed (Report Not Submitted)");
        }

        return internRepository.save(intern);
    }

    // 6. Issue Certificate
    @PutMapping("/{id}/issue-certificate")
    public Intern issueCertificate(@PathVariable Long id) {
        Intern intern = internRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intern not found with ID: " + id));

        intern.setStatus("Issued Certificate");
        return internRepository.save(intern);
    }
}



