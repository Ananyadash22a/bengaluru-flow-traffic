package com.bengaluruflow.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "traffic_zones")
public class TrafficZone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String name;
    @Column(nullable = false)
    private int congestion;
    @Column(nullable = false)
    private int averageSpeed;
    @Column(nullable = false)
    private int delayMinutes;
    @Column(nullable = false)
    private double mapX;
    @Column(nullable = false)
    private double mapY;

    protected TrafficZone() { }

    public TrafficZone(String name, int congestion, int averageSpeed, int delayMinutes, double mapX, double mapY) {
        this.name = name;
        this.congestion = congestion;
        this.averageSpeed = averageSpeed;
        this.delayMinutes = delayMinutes;
        this.mapX = mapX;
        this.mapY = mapY;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public int getCongestion() { return congestion; }
    public int getAverageSpeed() { return averageSpeed; }
    public int getDelayMinutes() { return delayMinutes; }
    public double getMapX() { return mapX; }
    public double getMapY() { return mapY; }
    public void updateTraffic(int congestion, int averageSpeed, int delayMinutes) {
        this.congestion = congestion;
        this.averageSpeed = averageSpeed;
        this.delayMinutes = delayMinutes;
    }
    public String getStatus() {
        if (congestion < 30) return "LOW";
        if (congestion < 60) return "MODERATE";
        if (congestion < 85) return "HEAVY";
        return "SEVERE";
    }
}