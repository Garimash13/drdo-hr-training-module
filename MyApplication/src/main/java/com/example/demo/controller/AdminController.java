package com.example.demo.controller;

import com.example.demo.model.Intern;
import com.example.demo.model.Mentor;
import com.example.demo.repository.InternRepository;
import com.example.demo.repository.MentorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    // 🔹 Status constants to keep them consistent
    private static final String STATUS_MENTOR_ASSIGNED = "Mentor Assigned";
    private static final String STATUS_ONGOING = "Ongoing Internship";
    private static final String STATUS_COMPLETED = "Completed Internship";
    private static final String STATUS_CERTIFICATE_ISSUED = "Certificate Issued";
    private static final String STATUS_REJECTED = "Rejected";

    @Autowired
    private InternRepository internRepository;

    @Autowired
    private MentorRepository mentorRepository;

    // ✅ Assign mentor to an intern → status = "Mentor Assigned"
    @PutMapping("/interns/{internId}/assign-mentor")
    public ResponseEntity<?> assignMentor(
            @PathVariable Long internId,
            @RequestBody MentorAssignmentRequest request
    ) {
        Optional<Intern> optionalIntern = internRepository.findById(internId);
        if (optionalIntern.isEmpty()) {
            return ResponseEntity.status(404).body("Intern not found");
        }

        Optional<Mentor> optionalMentor = mentorRepository.findById(request.getMentorId());
        if (optionalMentor.isEmpty()) {
            return ResponseEntity.status(404).body("Mentor not found");
        }

        Intern intern = optionalIntern.get();
        Mentor mentor = optionalMentor.get();

        intern.setMentorId(mentor.getId());
        intern.setMentorName(mentor.getName());
        intern.setStatus(STATUS_MENTOR_ASSIGNED); // ✅ Now goes to mentor portal as "New Intern"

        Intern saved = internRepository.save(intern);
        return ResponseEntity.ok(saved);
    }

    // ✅ Admin endpoint to get all interns in "Mentor Assigned" status
    @GetMapping("/interns/new")
    public List<Intern> getNewInterns() {
        return internRepository.findByStatusIgnoreCase(STATUS_MENTOR_ASSIGNED);
    }

    // ✅ Get all rejected interns without mentor
    @GetMapping("/interns/rejected")
    public List<Intern> getRejectedInternsWithoutMentor() {
        return internRepository.findByStatusIgnoreCaseAndMentorIdIsNull(STATUS_REJECTED);
    }

    // ✅ Get all mentors except excluded mentor
    @GetMapping("/available-mentors/{excludeMentorId}")
    public List<Mentor> getAvailableMentors(@PathVariable Long excludeMentorId) {
        return mentorRepository.findAll()
                .stream()
                .filter(m -> !m.getId().equals(excludeMentorId))
                .toList();
    }

    // ✅ Get all ongoing interns
    @GetMapping("/interns/ongoing")
    public List<Intern> getOngoingInterns() {
        return internRepository.findByStatusIgnoreCase(STATUS_ONGOING);
    }

    // ✅ Get all interns (for Completed Internships section)
    @GetMapping("/interns/all")
    public List<Intern> getAllInterns() {
        return internRepository.findAll();
    }

    // DTO for mentor assignment
    public static class MentorAssignmentRequest {
        private Long mentorId;
        private String mentorName;

        public Long getMentorId() { return mentorId; }
        public void setMentorId(Long mentorId) { this.mentorId = mentorId; }

        public String getMentorName() { return mentorName; }
        public void setMentorName(String mentorName) { this.mentorName = mentorName; }
    }
}
