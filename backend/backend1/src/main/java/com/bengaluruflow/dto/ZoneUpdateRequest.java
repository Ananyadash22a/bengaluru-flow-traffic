package com.bengaluruflow.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record ZoneUpdateRequest(@Min(0) @Max(100) int congestion, @Min(0) @Max(180) int speed, @Min(0) @Max(240) int delay) { }