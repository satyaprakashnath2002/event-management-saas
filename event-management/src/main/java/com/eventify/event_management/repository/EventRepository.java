package com.eventify.event_management.repository;

import com.eventify.event_management.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {

    // Custom queries can go here
    // Example:
    // List<Event> findByLocation(String location);
}