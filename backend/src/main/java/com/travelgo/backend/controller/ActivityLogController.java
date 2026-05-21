package com.travelgo.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelgo.backend.model.ActivityLog;
import com.travelgo.backend.repository.ActivityLogRepository;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ActivityLogController {

    @Autowired
    private ActivityLogRepository activityLogRepository;
    
    @GetMapping("/recent")
    public List<ActivityLog> getRecentActivities() {
        return activityLogRepository.findTop10ByOrderByTimestampDesc();
    }
    
    @PostMapping
    public ActivityLog createActivity(@RequestBody ActivityLog activity) {
        return activityLogRepository.save(activity);
    }
}