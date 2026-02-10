package com.eventify.event_management.repository;

import com.eventify.event_management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Check if email already exists (for signup)
    boolean existsByEmail(String email);

    // Find user by email (for login)
    User findByEmail(String email);
}
