package com.travelgo.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.travelgo.backend.model.Tour;
import com.travelgo.backend.repository.TourRepository;

@RestController
@RequestMapping("/api/tours")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true", allowedHeaders = "*")
public class TourController {

    @Autowired
    private TourRepository tourRepository;

    // GET all tours
    @GetMapping
    public List<Tour> getAllTours() {
        return tourRepository.findAll();
    }

    // GET tour by ID
    @GetMapping("/{id}")
    public Tour getTourById(@PathVariable Long id) {
        return tourRepository.findById(id).orElse(null);
    }

    // CREATE new tour
    @PostMapping
    public Map<String, Object> createTour(@RequestBody Tour tour) {
        Map<String, Object> response = new HashMap<>();
        try {
            Tour savedTour = tourRepository.save(tour);
            response.put("success", true);
            response.put("message", "Tour created successfully!");
            response.put("tour", savedTour);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        return response;
    }

    // UPDATE tour
    @PutMapping("/{id}")
    public Map<String, Object> updateTour(@PathVariable Long id, @RequestBody Tour tourDetails) {
        Map<String, Object> response = new HashMap<>();
        try {
            Tour existingTour = tourRepository.findById(id).orElse(null);
            if (existingTour == null) {
                response.put("success", false);
                response.put("error", "Tour not found");
                return response;
            }

            existingTour.setName(tourDetails.getName());
            existingTour.setLocation(tourDetails.getLocation());
            existingTour.setDuration(tourDetails.getDuration());
            existingTour.setPrice(tourDetails.getPrice());
            existingTour.setDescription(tourDetails.getDescription());
            existingTour.setRating(tourDetails.getRating());
            existingTour.setBookings(tourDetails.getBookings());
            existingTour.setStatus(tourDetails.getStatus());

            Tour updatedTour = tourRepository.save(existingTour);
            response.put("success", true);
            response.put("message", "Tour updated successfully!");
            response.put("tour", updatedTour);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        return response;
    }

    // DELETE tour
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteTour(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Tour tour = tourRepository.findById(id).orElse(null);
            if (tour == null) {
                response.put("success", false);
                response.put("error", "Tour not found");
                return response;
            }
            tourRepository.deleteById(id);
            response.put("success", true);
            response.put("message", "Tour deleted successfully!");
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        return response;
    }
}