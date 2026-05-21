package com.travelgo.backend.repository;

import com.travelgo.backend.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TourRepository extends JpaRepository<Tour, Long> {
}