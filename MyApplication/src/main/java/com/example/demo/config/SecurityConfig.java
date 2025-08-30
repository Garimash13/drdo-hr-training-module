package com.example.demo.config; // change if needed

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // disable CSRF for API testing
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/login/**").permitAll() // allow login endpoint
                .anyRequest().permitAll() // or .authenticated() if you want to secure other routes
            )
            .httpBasic(Customizer.withDefaults()); // optional: enables basic auth (can be removed)
        return http.build();
    }
}

