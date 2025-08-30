package com.example.demo.repository;

import com.example.demo.model.Mentor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MentorRepository extends JpaRepository<Mentor, Long> {
    Mentor findByEmailAndPassword(String email, String password);
    Mentor findByName(String name);   
}
