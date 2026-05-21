package com.travelgo.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelgo.backend.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Find bookings by user ID
    List<Booking> findByUserId(Long userId);
    
    // Find bookings by user ID ordered by created date (newest first)
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
}