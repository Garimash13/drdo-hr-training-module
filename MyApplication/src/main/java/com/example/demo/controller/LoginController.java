package com.example.demo.controller;

import com.example.demo.model.Admin;
import com.example.demo.model.Mentor;
import com.example.demo.repository.AdminRepository;
import com.example.demo.repository.MentorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LoginController {

    @Autowired
    private AdminRepository adminRepo;

    @Autowired
    private MentorRepository mentorRepo;

    // Admin login using username and password
    @PostMapping("/login/admin")
    public Admin adminLogin(@RequestParam String username, @RequestParam String password) {
        return adminRepo.findByUsernameAndPassword(username, password);
    }

    // Mentor login using email and password
    @PostMapping("/login/mentor")
    public Mentor mentorLogin(@RequestParam String email, @RequestParam String password) {
        return mentorRepo.findByEmailAndPassword(email, password);
    }
}



