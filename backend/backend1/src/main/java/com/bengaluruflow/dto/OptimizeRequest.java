package com.bengaluruflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record OptimizeRequest(@NotBlank @Size(max = 100) String origin, @NotBlank @Size(max = 100) String destination,
        @NotBlank @Size(max = 20) String priority) { }