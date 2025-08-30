package com.example.demo.repository;

import com.example.demo.model.Intern;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InternRepository extends JpaRepository<Intern, Long> {

    // ✅ Get interns assigned to a specific mentor with a given status
    List<Intern> findByMentorIdAndStatus(Long mentorId, String status);

    // ✅ Get interns by status (case-sensitive)
    List<Intern> findByStatus(String status);

    // ✅ Get interns by status (case-insensitive)
    List<Intern> findByStatusIgnoreCase(String status);

    // ✅ Get all interns assigned to a specific mentor
    List<Intern> findByMentorId(Long mentorId);

    // ✅ Get interns by status where no mentor is assigned
    List<Intern> findByStatusAndMentorIdIsNull(String status);

    // ✅ Get interns by status (case-insensitive) where no mentor is assigned
    List<Intern> findByStatusIgnoreCaseAndMentorIdIsNull(String status);
}
