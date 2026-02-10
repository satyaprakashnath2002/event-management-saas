package com.eventify.event_management.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    @PostMapping
    public ResponseEntity<Map<String, String>> getAIResponse(
            @RequestBody Map<String, String> payload
    ) {
        String userMessage = payload.get("message");

        if (userMessage == null || userMessage.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("reply", "Message cannot be empty"));
        }

        userMessage = userMessage.toLowerCase();
        String botResponse;

        // 🔹 Mock AI logic (temporary)
        if (userMessage.contains("ticket")) {
            botResponse = "You can find your tickets in the Dashboard after logging in 🎟️";
        } 
        else if (userMessage.contains("event")) {
            botResponse = "We have many exciting events! Visit the Home page to explore 🎉";
        } 
        else if (userMessage.contains("payment")) {
            botResponse = "Payments are handled securely during checkout 💳";
        }
        else {
            botResponse = "I'm your Eventify Assistant 🤖. How can I help you today?";
        }

        return ResponseEntity.ok(Map.of("reply", botResponse));
    }
}

