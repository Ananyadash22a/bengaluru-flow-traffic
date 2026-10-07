package com.bengaluruflow.service;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.bengaluruflow.dto.ZoneResponse;
import com.bengaluruflow.dto.ZoneUpdateRequest;
import com.bengaluruflow.entity.TrafficZone;
import com.bengaluruflow.repository.TrafficZoneRepository;

@Service
public class TrafficService {
    private final TrafficZoneRepository zones;
    public TrafficService(TrafficZoneRepository zones) { this.zones = zones; }
    @Transactional(readOnly = true) public List<ZoneResponse> getZones() { return zones.findAll().stream().map(this::toResponse).toList(); }
    @Transactional(readOnly = true) public ZoneResponse getZone(long id) { return toResponse(find(id)); }
    @Transactional public ZoneResponse update(long id, ZoneUpdateRequest request) {
        TrafficZone zone = find(id); zone.updateTraffic(request.congestion(), request.speed(), request.delay()); return toResponse(zone);
    }
    private TrafficZone find(long id) { return zones.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Traffic zone not found")); }
    private ZoneResponse toResponse(TrafficZone z) { return new ZoneResponse(z.getId(), z.getName(), z.getStatus(), z.getCongestion(), z.getAverageSpeed(), z.getDelayMinutes(), "2 min ago", z.getMapX(), z.getMapY()); }
}