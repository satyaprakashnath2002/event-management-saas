package com.eventify.event_management.controller;

import com.eventify.event_management.model.Booking;
import com.eventify.event_management.model.Event;
import com.eventify.event_management.model.User;
import com.eventify.event_management.repository.BookingRepository;
import com.eventify.event_management.repository.EventRepository;
import com.eventify.event_management.repository.UserRepository;
import com.eventify.event_management.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private EmailService emailService;

    /**
     * ✅ OPTIMIZED: Get bookings for a user using Repository Query
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable Long userId) {
        // Use a custom query method in repository instead of .findAll().filter()
        List<Booking> userBookings = bookingRepository.findByUserIdOrderByIdDesc(userId);
        return ResponseEntity.ok(userBookings);
    }

    /**
     * ✅ OPTIMIZED: Get guest list for specific event
     */
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Map<String, Object>>> getBookingsByEvent(@PathVariable Long eventId) {
        List<Booking> eventBookings = bookingRepository.findByEventId(eventId);

        List<Map<String, Object>> response = eventBookings.stream().map(b -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", b.getId());
            map.put("ticketCode", b.getTicketCode());
            map.put("customerName", b.getUser() != null ? b.getUser().getName() : "Unknown");
            map.put("customerEmail", b.getUser() != null ? b.getUser().getEmail() : "N/A");
            map.put("checkedIn", "CHECKED_IN".equals(b.getStatus()));
            map.put("status", b.getStatus());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * ✅ BROADCAST: Send notification to all attendees
     */
    @PostMapping("/admin/broadcast/{eventId}")
    public ResponseEntity<?> broadcastMessage(@PathVariable Long eventId, @RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        String subject = payload.get("subject");

        List<Booking> bookings = bookingRepository.findByEventId(eventId);
        List<String> emails = bookings.stream()
                .map(b -> b.getUser().getEmail())
                .distinct()
                .collect(Collectors.toList());

        if (emails.isEmpty()) return ResponseEntity.badRequest().body("No guests to notify.");

        emails.forEach(email -> {
            try {
                emailService.sendSimpleMessage(email, subject, message);
            } catch (Exception e) {
                System.err.println("Broadcast failed for: " + email);
            }
        });

        return ResponseEntity.ok("Successfully notified " + emails.size() + " guests.");
    }

    /**
     * ✅ TRANSACTIONAL: Secure Booking with Seat Validation
     */
    @PostMapping("/book")
    @Transactional
    public ResponseEntity<?> bookEvent(@RequestBody Map<String, Long> payload) {
        Long userId = payload.get("userId");
        Long eventId = payload.get("eventId");

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Seat check logic
        if (event.getTotalSeats() != null && event.getTotalSeats() <= 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("This event is sold out!");
        }

        // Deduct seats
        event.setTotalSeats(event.getTotalSeats() - 1);
        eventRepository.save(event);

        // Create Booking
        Booking booking = new Booking();
        booking.setEvent(event);
        booking.setUser(user);
        booking.setStatus("CONFIRMED");
        booking.setTicketCode("EVT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        Booking savedBooking = bookingRepository.save(booking);

        // Async Email Trigger
        try {
            emailService.sendTicketConfirmation(user.getEmail(), user.getName(), event.getTitle(), savedBooking.getTicketCode());
        } catch (Exception e) {
            System.err.println("Email worker failed: " + e.getMessage());
        }

        return ResponseEntity.ok(savedBooking);
    }

    /**
     * ✅ VERIFY: High-speed Gate Check-in
     */
    @PostMapping("/verify/{ticketCodeOrId}")
    @Transactional
    public ResponseEntity<?> verifyTicket(@PathVariable String ticketCodeOrId) {
        Optional<Booking> bookingOpt = bookingRepository.findByTicketCode(ticketCodeOrId);
        
        if (bookingOpt.isEmpty()) {
            try {
                Long id = Long.parseLong(ticketCodeOrId);
                bookingOpt = bookingRepository.findById(id);
            } catch (Exception e) { /* Not a Long */ }
        }

        if (bookingOpt.isEmpty()) return ResponseEntity.status(404).body("❌ Ticket not found.");

        Booking booking = bookingOpt.get();

        if ("CHECKED_IN".equals(booking.getStatus())) {
            return ResponseEntity.badRequest().body("⚠️ Warning: Ticket already scanned!");
        }
        
        booking.setStatus("CHECKED_IN");
        bookingRepository.save(booking); 
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "✅ Verified! Welcome, " + booking.getUser().getName());
        response.put("event", booking.getEvent().getTitle());
        response.put("customer", booking.getUser().getName());
        
        return ResponseEntity.ok(response);
    }

    /**
     * ✅ DASHBOARD STATS: Summary for Admin UI
     */
    @GetMapping("/admin/stats")
    public ResponseEntity<?> getAdminStats() {
        List<Booking> allBookings = bookingRepository.findAll();
        
        double totalRevenue = allBookings.stream()
                .mapToDouble(b -> (b.getEvent() != null && b.getEvent().getPrice() != null) ? b.getEvent().getPrice() : 0.0)
                .sum();

        long checkedInCount = allBookings.stream()
                .filter(b -> "CHECKED_IN".equals(b.getStatus()))
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBookings", allBookings.size());
        stats.put("totalRevenue", totalRevenue);
        stats.put("checkedIn", checkedInCount);
        stats.put("recentBookings", allBookings.stream()
                .sorted(Comparator.comparing(Booking::getId).reversed())
                .limit(5)
                .collect(Collectors.toList()));

        return ResponseEntity.ok(stats);
    }
}