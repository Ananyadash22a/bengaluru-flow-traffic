package com.bengaluruflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record IncidentRequest(@NotBlank @Size(max = 50) String type, @NotBlank @Size(max = 120) String location,
        @NotBlank @Size(max = 20) String severity, @NotBlank @Size(min = 12, max = 500) String description) { }