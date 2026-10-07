package com.bengaluruflow.dto;

public record IncidentResponse(Long id, String type, String location, String severity, String status, String reportedAt, String description) { }