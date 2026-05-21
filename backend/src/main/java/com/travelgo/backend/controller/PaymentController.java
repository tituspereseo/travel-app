package com.travelgo.backend.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.travelgo.backend.model.Booking;
import com.travelgo.backend.model.Payment;
import com.travelgo.backend.repository.BookingRepository;
import com.travelgo.backend.repository.PaymentRepository;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping("/gcash/process")
    public Map<String, Object> processGCashPayment(@RequestBody Map<String, Object> paymentData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Long bookingId = Long.valueOf(paymentData.get("bookingId").toString());
            String phoneNumber = paymentData.get("phoneNumber").toString();
            BigDecimal amount = new BigDecimal(paymentData.get("amount").toString());
            
            Booking booking = bookingRepository.findById(bookingId).orElse(null);
            if (booking == null) {
                response.put("success", false);
                response.put("error", "Booking not found");
                return response;
            }
            
            String paymentNumber = "PAY" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            String referenceNumber = "GCASH" + System.currentTimeMillis() + new Random().nextInt(9999);
            
            Payment payment = new Payment();
            payment.setPaymentNumber(paymentNumber);
            payment.setBookingId(bookingId);
            payment.setUserId(booking.getUserId());
            payment.setAmount(amount);
            payment.setPaymentMethod("GCash");
            payment.setStatus("completed");
            payment.setTransactionId(referenceNumber);
            payment.setPaymentDate(LocalDateTime.now());
            
            paymentRepository.save(payment);
            
            booking.setPaymentStatus("completed");
            booking.setStatus("confirmed");
            bookingRepository.save(booking);
            
            response.put("success", true);
            response.put("message", "Payment successful!");
            response.put("referenceNumber", referenceNumber);
            response.put("transactionId", referenceNumber);
            response.put("paymentNumber", paymentNumber);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        
        return response;
    }
    
    @GetMapping
    public Iterable<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
    
    @GetMapping("/booking/{bookingId}")
    public Payment getPaymentByBookingId(@PathVariable Long bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }
}