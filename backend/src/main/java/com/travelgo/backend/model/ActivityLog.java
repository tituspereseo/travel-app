package com.travelgo.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
public class ActivityLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String action;
    private String details;
    private String icon;
    private LocalDateTime timestamp;
    
    @Column(name = "username")
    private String username;
    
    // Constructors
    public ActivityLog() {}
    
    public ActivityLog(String action, String details, String icon, LocalDateTime timestamp, String username) {
        this.action = action;
        this.details = details;
        this.icon = icon;
        this.timestamp = timestamp;
        this.username = username;
    }
    
    // Getters
    public Long getId() { return id; }
    public String getAction() { return action; }
    public String getDetails() { return details; }
    public String getIcon() { return icon; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public String getUsername() { return username; }
    
    // Setters
    public void setId(Long id) { this.id = id; }
    public void setAction(String action) { this.action = action; }
    public void setDetails(String details) { this.details = details; }
    public void setIcon(String icon) { this.icon = icon; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public void setUsername(String username) { this.username = username; }
}