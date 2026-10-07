package com.bengaluruflow.entity;

import java.time.Instant;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "emergency_requests")
public class EmergencyRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String origin;
    @Column(nullable = false)
    private String destination;
    @Column(nullable = false)
    private String priority;
    @Column(nullable = false)
    private int etaMinutes;
    @Column(nullable = false, length = 500)
    private String recommendedRoute;
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    protected EmergencyRequest() { }
    public EmergencyRequest(String origin, String destination, String priority, int etaMinutes, String recommendedRoute) {
        this.origin = origin; this.destination = destination; this.priority = priority; this.etaMinutes = etaMinutes; this.recommendedRoute = recommendedRoute;
    }
    @PrePersist void setCreatedAt() { if (createdAt == null) createdAt = Instant.now(); }
    public Long getId() { return id; }
    public String getOrigin() { return origin; }
    public String getDestination() { return destination; }
    public String getPriority() { return priority; }
    public int getEtaMinutes() { return etaMinutes; }
    public String getRecommendedRoute() { return recommendedRoute; }
    public Instant getCreatedAt() { return createdAt; }
}