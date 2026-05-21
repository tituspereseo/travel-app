package com.travelgo.backend.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelgo.backend.model.Booking;
import com.travelgo.backend.model.ActivityLog;
import com.travelgo.backend.repository.BookingRepository;
import com.travelgo.backend.repository.ActivityLogRepository;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private ActivityLogRepository activityLogRepository;

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(@PathVariable Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return bookingRepository.findById(id).orElse(null);
    }
    
    @PostMapping
    public Map<String, Object> createBooking(@RequestBody Map<String, Object> bookingData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("=========================================");
            System.out.println("📝 Received booking request:");
            System.out.println("   userId: " + bookingData.get("userId"));
            System.out.println("   tourId: " + bookingData.get("tourId"));
            System.out.println("   customerName: " + bookingData.get("customerName"));
            System.out.println("   travelDate: " + bookingData.get("travelDate"));
            System.out.println("   guests: " + bookingData.get("guests"));
            System.out.println("   totalAmount: " + bookingData.get("totalAmount"));
            System.out.println("=========================================");
            
            Booking booking = new Booking();
            
            String bookingNumber = "TRV" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            booking.setBookingNumber(bookingNumber);
            
            booking.setUserId(Long.valueOf(bookingData.get("userId").toString()));
            booking.setTourId(Long.valueOf(bookingData.get("tourId").toString()));
            booking.setCustomerName(bookingData.get("customerName").toString());
            booking.setCustomerEmail(bookingData.get("customerEmail").toString());
            booking.setCustomerPhone(bookingData.get("customerPhone") != null ? bookingData.get("customerPhone").toString() : "");
            booking.setTravelDate(LocalDate.parse(bookingData.get("travelDate").toString()));
            booking.setGuests(Integer.valueOf(bookingData.get("guests").toString()));
            booking.setTotalAmount(new java.math.BigDecimal(bookingData.get("totalAmount").toString()));
            
            if (bookingData.containsKey("specialRequests") && bookingData.get("specialRequests") != null) {
                System.out.println("   Special Requests: " + bookingData.get("specialRequests"));
            }
            
            booking.setStatus("pending");
            booking.setPaymentStatus("pending");
            booking.setCreatedAt(LocalDateTime.now());
            
            Booking savedBooking = bookingRepository.save(booking);
            
            // Add activity log for new booking - COMMENTED OUT
            // ActivityLog activity = new ActivityLog(
            //     bookingData.get("customerName").toString(),
            //     "created a new booking",
            //     "Booked tour for " + bookingData.get("guests") + " guests | Booking #: " + bookingNumber,
            //     "fa-bookmark"
            // );
            // activityLogRepository.save(activity);
            
            System.out.println("✅ Booking saved successfully! ID: " + savedBooking.getId());
            
            response.put("success", true);
            response.put("message", "Booking created successfully!");
            response.put("booking", savedBooking);
            response.put("bookingNumber", bookingNumber);
            
        } catch (Exception e) {
            System.err.println("❌ Error creating booking: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        
        return response;
    }
    
    @PutMapping("/{id}/status")
    public Map<String, Object> updateBookingStatus(@PathVariable Long id, @RequestBody Map<String, String> statusData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Booking booking = bookingRepository.findById(id).orElse(null);
            if (booking == null) {
                response.put("success", false);
                response.put("error", "Booking not found");
                return response;
            }
            
            String oldStatus = booking.getStatus();
            String newStatus = statusData.get("status");
            booking.setStatus(newStatus);
            bookingRepository.save(booking);
            
            // Add activity log for status update - COMMENTED OUT
            // ActivityLog activity = new ActivityLog(
            //     booking.getCustomerName(),
            //     "updated booking status",
            //     "Booking #" + booking.getBookingNumber() + " status changed from " + oldStatus + " to " + newStatus,
            //     "fa-edit"
            // );
            // activityLogRepository.save(activity);
            
            response.put("success", true);
            response.put("message", "Booking status updated!");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        
        return response;
    }
    
    @PutMapping("/{id}/payment")
    public Map<String, Object> updatePaymentStatus(@PathVariable Long id, @RequestBody Map<String, String> paymentData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Booking booking = bookingRepository.findById(id).orElse(null);
            if (booking == null) {
                response.put("success", false);
                response.put("error", "Booking not found");
                return response;
            }
            
            String oldPaymentStatus = booking.getPaymentStatus();
            String newPaymentStatus = paymentData.get("paymentStatus");
            booking.setPaymentStatus(newPaymentStatus);
            bookingRepository.save(booking);
            
            // Add activity log for payment update - COMMENTED OUT
            // ActivityLog activity = new ActivityLog(
            //     booking.getCustomerName(),
            //     "updated payment status",
            //     "Booking #" + booking.getBookingNumber() + " payment changed from " + oldPaymentStatus + " to " + newPaymentStatus,
            //     "fa-credit-card"
            // );
            // activityLogRepository.save(activity);
            
            response.put("success", true);
            response.put("message", "Payment status updated!");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        
        return response;
    }
    
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteBooking(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Booking booking = bookingRepository.findById(id).orElse(null);
            if (booking == null) {
                response.put("success", false);
                response.put("error", "Booking not found");
                return response;
            }
            
            String bookingNumber = booking.getBookingNumber();
            String customerName = booking.getCustomerName();
            
            bookingRepository.deleteById(id);
            
            // Add activity log for deletion - COMMENTED OUT
            // ActivityLog activity = new ActivityLog(
            //     "System",
            //     "deleted a booking",
            //     "Booking #" + bookingNumber + " by " + customerName + " was deleted",
            //     "fa-trash"
            // );
            // activityLogRepository.save(activity);
            
            response.put("success", true);
            response.put("message", "Booking deleted successfully!");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        
        return response;
    }
    
    @PostMapping("/{id}/cancel")
    public Map<String, Object> cancelBooking(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Booking booking = bookingRepository.findById(id).orElse(null);
            if (booking == null) {
                response.put("success", false);
                response.put("error", "Booking not found");
                return response;
            }
            
            booking.setStatus("cancelled");
            bookingRepository.save(booking);
            
            // Add activity log for cancellation - COMMENTED OUT
            // ActivityLog activity = new ActivityLog(
            //     booking.getCustomerName(),
            //     "cancelled a booking",
            //     "Booking #" + booking.getBookingNumber() + " has been cancelled",
            //     "fa-times-circle"
            // );
            // activityLogRepository.save(activity);
            
            response.put("success", true);
            response.put("message", "Booking cancelled successfully!");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        
        return response;
    }
}