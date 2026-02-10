package com.eventify.event_management.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor // Lombok generates the empty constructor automatically
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(unique = true, nullable = false)
    private String ticketCode; // Unique code for the ticket

    private LocalDateTime bookingDate;
    
    private String status; // e.g., "CONFIRMED", "CANCELLED"

    private Double amountPaid;

    /**
     * This method runs automatically right before the booking is saved to the DB.
     * It ensures the date is set and a unique ticket code is generated.
     */
    @PrePersist
    protected void onCreate() {
        this.bookingDate = LocalDateTime.now();
        if (this.status == null) {
            this.status = "CONFIRMED";
        }
        // Generates a unique 8-character ticket code: e.g., TIX-A1B2C3D4
        if (this.ticketCode == null) {
            this.ticketCode = "TIX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }
}