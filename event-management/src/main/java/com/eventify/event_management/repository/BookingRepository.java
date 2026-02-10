package com.eventify.event_management.repository;

import com.eventify.event_management.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /**
     * ✅ UPDATED: Fetch user bookings sorted by ID descending.
     * This ensures the most recent tickets appear first on the User Dashboard.
     */
    List<Booking> findByUserIdOrderByIdDesc(Long userId);

    /**
     * ✅ NEW: Fetch all bookings for a specific event.
     * Essential for the Admin "Guest List" and "Broadcast" features.
     */
    List<Booking> findByEventId(Long eventId);

    /**
     * ✅ FIXED: Returns Optional<Booking> for ticket verification.
     */
    Optional<Booking> findByTicketCode(String ticketCode);

    /**
     * ✅ UTILITY: Count total tickets sold for an event.
     * Used for dashboard stats and seat synchronization.
     */
    long countByEventId(Long eventId);
}