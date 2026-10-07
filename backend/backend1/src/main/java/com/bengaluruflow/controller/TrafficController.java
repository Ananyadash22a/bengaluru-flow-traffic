package com.bengaluruflow.controller;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bengaluruflow.dto.ZoneResponse;
import com.bengaluruflow.dto.ZoneUpdateRequest;
import com.bengaluruflow.service.TrafficService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/traffic/zones")
public class TrafficController {
    private final TrafficService traffic;
    public TrafficController(TrafficService traffic) { this.traffic = traffic; }
    @GetMapping public List<ZoneResponse> getAll() { return traffic.getZones(); }
    @GetMapping("/{id}") public ZoneResponse getOne(@PathVariable long id) { return traffic.getZone(id); }
    @PutMapping("/{id}") public ZoneResponse update(@PathVariable long id, @Valid @RequestBody ZoneUpdateRequest request) { return traffic.update(id, request); }
}