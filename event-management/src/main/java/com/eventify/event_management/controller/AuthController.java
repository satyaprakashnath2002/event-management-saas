package com.eventify.event_management.controller;

import com.eventify.event_management.model.User;
import com.eventify.event_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000") // React frontend
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "API is working!");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User signUpRequest) {
        try {
            if (signUpRequest.getEmail() == null || signUpRequest.getPassword() == null) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Email and password cannot be null");
                return ResponseEntity.badRequest().body(response);
            }

            if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Error: Email is already in use!");
                return ResponseEntity.badRequest().body(response);
            }

            User user = new User();
            user.setName(signUpRequest.getName());
            user.setEmail(signUpRequest.getEmail());
            user.setPassword(signUpRequest.getPassword()); // plaintext for now
            user.setRole("USER");

            userRepository.save(user);

            Map<String, String> successResponse = new HashMap<>();
            successResponse.put("message", "User registered successfully!");
            return ResponseEntity.ok(successResponse);

        } catch (Exception e) {
            // Log the exception for debugging
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal server error during registration");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User loginRequest) {
        try {
            if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
                return ResponseEntity.badRequest().body("Email and password are required");
            }

            User user = userRepository.findByEmail(loginRequest.getEmail());

            if (user == null || !user.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.status(401).body("Invalid email or password");
            }

            // Optionally, you can remove password before sending
            user.setPassword(null);

            return ResponseEntity.ok(user);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error during login");
        }
    }
}
