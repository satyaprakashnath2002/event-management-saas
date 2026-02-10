package com.eventify.event_management.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(length = 1000)
    private String description;
    
    private String location;

    private String category; 

    @Column(length = 500) 
    private String imageUrl;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private Double price = 0.0;

    // Explicitly mapping column names to match MySQL standard (snake_case)
    @Column(name = "total_seats")
    private Integer totalSeats = 0; // Default to 0 instead of null

    @Column(name = "available_seats")
    private Integer availableSeats = 0; // Default to 0 instead of null

    /**
     * Intelligent Sync:
     * Triggered before saving a new event to the database.
     */
    @PrePersist
    public void onCreate() {
        // If totalSeats was provided but availableSeats is null/0, sync them
        if (this.totalSeats != null && (this.availableSeats == null || this.availableSeats == 0)) {
            this.availableSeats = this.totalSeats;
        }
    }
}