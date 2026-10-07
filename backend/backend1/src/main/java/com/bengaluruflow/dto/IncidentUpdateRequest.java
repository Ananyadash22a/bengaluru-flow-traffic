package com.bengaluruflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record IncidentUpdateRequest(@NotBlank @Size(max = 20) String severity, @NotBlank @Size(max = 20) String status) { }