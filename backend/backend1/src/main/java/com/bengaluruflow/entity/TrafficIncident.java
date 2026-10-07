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
@Table(name = "traffic_incidents")
public class TrafficIncident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String type;
    @Column(nullable = false)
    private String location;
    @Column(nullable = false)
    private String severity;
    @Column(nullable = false, length = 500)
    private String description;
    @Column(nullable = false)
    private String status = "ACTIVE";
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    protected TrafficIncident() { }
    public TrafficIncident(String type, String location, String severity, String description) {
        this.type = type; this.location = location; this.severity = severity; this.description = description;
    }
    @PrePersist void setCreatedAt() { if (createdAt == null) createdAt = Instant.now(); }
    public Long getId() { return id; }
    public String getType() { return type; }
    public String getLocation() { return location; }
    public String getSeverity() { return severity; }
    public String getDescription() { return description; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public void update(String severity, String status) { this.severity = severity; this.status = status; }
}