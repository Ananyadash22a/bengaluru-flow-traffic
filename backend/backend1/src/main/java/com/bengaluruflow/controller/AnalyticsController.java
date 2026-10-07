package com.bengaluruflow.controller;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bengaluruflow.repository.TrafficIncidentRepository;
import com.bengaluruflow.repository.TrafficZoneRepository;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    private final TrafficZoneRepository zones;
    private final TrafficIncidentRepository incidents;
    public AnalyticsController(TrafficZoneRepository zones, TrafficIncidentRepository incidents) { this.zones = zones; this.incidents = incidents; }
    @GetMapping("/traffic") public Map<String, Object> traffic() {
        List<Map<String, Object>> byZone = zones.findAll().stream().map(z -> Map.<String, Object>of("zone", z.getName(), "congestion", z.getCongestion(), "delay", z.getDelayMinutes())).toList();
        return Map.of("simulated", true, "averageDelayMinutes", 12.4, "responseTimeMinutes", 8.7, "routeEfficiencyPercent", 76, "peakHour", "18:00", "byZone", byZone,
                "peakTrafficHours", List.of(Map.of("hour", "08:00", "index", 81), Map.of("hour", "18:00", "index", 94)));
    }
    @GetMapping("/incidents") public Map<String, Object> incidentAnalytics() {
        Map<String, Long> distribution = incidents.findAll().stream().collect(java.util.stream.Collectors.groupingBy(com.bengaluruflow.entity.TrafficIncident::getType, java.util.stream.Collectors.counting()));
        return Map.of("simulated", true, "total", incidents.count(), "byType", distribution);
    }
}