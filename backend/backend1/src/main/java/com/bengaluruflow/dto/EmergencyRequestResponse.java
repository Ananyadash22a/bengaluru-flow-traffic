package com.bengaluruflow.dto;

import java.time.Instant;

public record EmergencyRequestResponse(Long id, String origin, String destination, String priority, int etaMinutes, String recommendedRoute, Instant createdAt) { }