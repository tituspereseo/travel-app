package com.travelgo.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.travelgo.backend.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByBookingId(Long bookingId);
}