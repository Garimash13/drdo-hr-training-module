package com.example.demo.controller;

import com.example.demo.model.Intern;
import com.example.demo.model.Mentor;
import com.example.demo.repository.InternRepository;
import com.example.demo.repository.MentorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mentors")
@CrossOrigin(origins = "http://localhost:3000")
public class MentorController {

    // 🔹 Centralize status strings
    private static final String STATUS_MENTOR_ASSIGNED = "Mentor Assigned";
    private static final String STATUS_ONGOING = "Ongoing Internship";
    private static final String STATUS_COMPLETED = "Completed Internship";
    private static final String STATUS_CERTIFICATE_ISSUED = "Certificate Issued";
    private static final String STATUS_REJECTED = "Rejected";

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private InternRepository internRepository;

    // ✅ Get all mentors
    @GetMapping
    public List<Mentor> getAllMentors() {
        return mentorRepository.findAll();
    }

    // ✅ Get interns assigned to this mentor
    @GetMapping("/{mentorId}/interns")
    public ResponseEntity<List<Intern>> getAssignedInterns(
            @PathVariable Long mentorId,
            @RequestParam(required = false) String status) {

        List<Intern> interns;
        if (status != null && !status.trim().isEmpty()) {
            interns = internRepository.findByMentorIdAndStatus(mentorId, status);
        } else {
            interns = internRepository.findByMentorIdAndStatus(mentorId, STATUS_MENTOR_ASSIGNED);
        }
        return ResponseEntity.ok(interns);
    }

    // ✅ Mentor accepts intern
    @PutMapping("/{mentorId}/interns/{internId}/accept")
    public ResponseEntity<?> acceptIntern(
            @PathVariable Long mentorId,
            @PathVariable Long internId,
            @RequestBody AcceptRequest body) {

        Intern intern = internRepository.findById(internId)
                .orElseThrow(() -> new RuntimeException("Intern not found"));

        if (intern.getMentorId() == null || !intern.getMentorId().equals(mentorId)) {
            return ResponseEntity.status(403).body("Not authorized or mentor mismatch");
        }

        intern.setStatus(STATUS_ONGOING);
        intern.setProjectName(body.getProjectName());
        intern.setDuration(body.getDuration());

        if (body.getStartDate() != null && !body.getStartDate().isBlank()) {
            intern.setStartDate(LocalDate.parse(body.getStartDate()));
        }

        internRepository.save(intern);
        return ResponseEntity.ok(intern);
    }

    public static class AcceptRequest {
        private String projectName;
        private String duration;
        private String startDate;

        public String getProjectName() { return projectName; }
        public void setProjectName(String projectName) { this.projectName = projectName; }
        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }
        public String getStartDate() { return startDate; }
        public void setStartDate(String startDate) { this.startDate = startDate; }
    }

    // ✅ Mentor rejects intern
    @PutMapping("/{mentorId}/interns/{internId}/reject")
    public ResponseEntity<?> rejectIntern(
            @PathVariable Long mentorId,
            @PathVariable Long internId,
            @RequestBody RejectRequest body) {

        Intern intern = internRepository.findById(internId)
                .orElseThrow(() -> new RuntimeException("Intern not found"));

        if (intern.getMentorId() == null || !intern.getMentorId().equals(mentorId)) {
            return ResponseEntity.status(403).body("Not authorized or mentor mismatch");
        }

        intern.setRemarks(body.getRemarks());
        intern.setRejectedByMentorId(mentorId);
        intern.setMentorId(null);
        intern.setMentorName(null);

        if (body.getSuggestedMentorId() != null) {
            Mentor suggestedMentor = mentorRepository.findById(body.getSuggestedMentorId())
                    .orElseThrow(() -> new RuntimeException("Suggested mentor not found"));
            intern.setMentorId(suggestedMentor.getId());
            intern.setMentorName(suggestedMentor.getName());
            intern.setStatus(STATUS_MENTOR_ASSIGNED);
        } else {
            intern.setStatus(STATUS_REJECTED);
        }

        internRepository.save(intern);
        return ResponseEntity.ok(intern);
    }

    public static class RejectRequest {
        private String remarks;
        private Long suggestedMentorId;

        public String getRemarks() { return remarks; }
        public void setRemarks(String remarks) { this.remarks = remarks; }
        public Long getSuggestedMentorId() { return suggestedMentorId; }
        public void setSuggestedMentorId(Long suggestedMentorId) { this.suggestedMentorId = suggestedMentorId; }
    }

    // ✅ Mark Ongoing Internship as Completed
    @PutMapping("/{mentorId}/interns/{internId}/complete")
    public ResponseEntity<?> markInternCompleted(
            @PathVariable Long mentorId,
            @PathVariable Long internId) {

        Intern intern = internRepository.findById(internId)
                .orElseThrow(() -> new RuntimeException("Intern not found"));

        if (intern.getMentorId() == null || !intern.getMentorId().equals(mentorId)) {
            return ResponseEntity.status(403).body("Not authorized or mentor mismatch");
        }

        intern.setStatus(STATUS_COMPLETED);
        internRepository.save(intern);

        return ResponseEntity.ok(intern);
    }

    // ✅ Get interns with Completed Internship status
    @GetMapping("/{mentorId}/interns/completed")
    public ResponseEntity<List<Intern>> getCompletedInterns(@PathVariable Long mentorId) {
        return ResponseEntity.ok(
                internRepository.findByMentorIdAndStatus(mentorId, STATUS_COMPLETED)
        );
    }

    // ✅ Confirm completion: stores completion date, project name, and marks certificate issued
    @PutMapping("/{mentorId}/interns/{internId}/confirm-completion")
    public ResponseEntity<?> confirmCompletion(
            @PathVariable Long mentorId,
            @PathVariable Long internId,
            @RequestBody CompletionRequest body) {

        Intern intern = internRepository.findById(internId)
                .orElseThrow(() -> new RuntimeException("Intern not found"));

        if (!mentorId.equals(intern.getMentorId())) {
            return ResponseEntity.status(403).body("Not authorized");
        }

        // Calculate completion date if not provided
        LocalDate completionDate = body.getCompletionDate();
        if (completionDate == null && intern.getStartDate() != null && intern.getDuration() != null) {
            completionDate = calculateEndDate(intern.getStartDate(), intern.getDuration());
        }
        intern.setCompletionDate(completionDate);

        // Save project name
        intern.setProjectName(body.getProjectName());

        // If report submitted, mark as certificate issued
        if (Boolean.TRUE.equals(body.getReportSubmitted())) {
            intern.setStatus(STATUS_CERTIFICATE_ISSUED);
        }

        internRepository.save(intern);
        return ResponseEntity.ok(intern);
    }

    private LocalDate calculateEndDate(LocalDate start, String duration) {
        String lower = duration.toLowerCase();
        if (lower.contains("week")) {
            int weeks = Integer.parseInt(lower.replaceAll("[^0-9]", ""));
            return start.plusWeeks(weeks);
        } else if (lower.contains("month")) {
            int months = Integer.parseInt(lower.replaceAll("[^0-9]", ""));
            return start.plusMonths(months);
        }
        return start;
    }

    public static class CompletionRequest {
        private LocalDate completionDate;
        private Boolean reportSubmitted;
        private String projectName;

        public LocalDate getCompletionDate() { return completionDate; }
        public void setCompletionDate(LocalDate completionDate) { this.completionDate = completionDate; }
        public Boolean getReportSubmitted() { return reportSubmitted; }
        public void setReportSubmitted(Boolean reportSubmitted) { this.reportSubmitted = reportSubmitted; }
        public String getProjectName() { return projectName; }
        public void setProjectName(String projectName) { this.projectName = projectName; }
    }

    // ✅ Get available mentors excluding the one who rejected
    @GetMapping("/available-mentors/{internId}")
    public List<Mentor> getAvailableMentorsForIntern(@PathVariable Long internId) {
        Intern intern = internRepository.findById(internId)
                .orElseThrow(() -> new RuntimeException("Intern not found"));

        Long excludedMentorId = intern.getRejectedByMentorId();

        return mentorRepository.findAll().stream()
                .filter(m -> excludedMentorId == null || !m.getId().equals(excludedMentorId))
                .collect(Collectors.toList());
    }
}


