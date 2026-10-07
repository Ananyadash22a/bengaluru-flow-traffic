package com.bengaluruflow.dto;

public record ZoneResponse(Long id, String name, String status, int congestion, int speed, int delay, String updatedAt, double x, double y) { }