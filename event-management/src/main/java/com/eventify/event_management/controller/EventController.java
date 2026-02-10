package com.eventify.event_management.controller;

import com.eventify.event_management.model.Event;
import com.eventify.event_management.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000") // Ensure this matches your React Port
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    // 1. Get all events
    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // 2. Create a new event
    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventRepository.save(event);
    }

    // 3. Get single event by ID
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id " + id));
        return ResponseEntity.ok(event);
    }

    // 4. Update an existing event
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id " + id));

        // Syncing all fields with the Frontend Quick Add/Edit form
        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setLocation(eventDetails.getLocation());
        event.setStartDate(eventDetails.getStartDate());
        event.setTotalSeats(eventDetails.getTotalSeats());
        
        // IMPORTANT: Added missing fields used in your React form
        event.setCategory(eventDetails.getCategory());
        event.setPrice(eventDetails.getPrice());
        event.setImageUrl(eventDetails.getImageUrl());

        Event updatedEvent = eventRepository.save(event);
        return ResponseEntity.ok(updatedEvent);
    }

    // 5. Delete an event
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Event not found with id " + id);
        }
        
        eventRepository.deleteById(id);
        return ResponseEntity.ok().body("{\"message\": \"Event deleted successfully with id: " + id + "\"}");
    }
}