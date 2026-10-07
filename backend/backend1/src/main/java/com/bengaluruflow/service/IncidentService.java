package com.bengaluruflow.service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.bengaluruflow.dto.IncidentRequest;
import com.bengaluruflow.dto.IncidentResponse;
import com.bengaluruflow.dto.IncidentUpdateRequest;
import com.bengaluruflow.entity.TrafficIncident;
import com.bengaluruflow.repository.TrafficIncidentRepository;

@Service
public class IncidentService {
    private final TrafficIncidentRepository incidents;
    public IncidentService(TrafficIncidentRepository incidents) { this.incidents = incidents; }
    @Transactional(readOnly = true) public List<IncidentResponse> getAll() { return incidents.findAll().stream().sorted((a,b) -> b.getCreatedAt().compareTo(a.getCreatedAt())).map(this::toResponse).toList(); }
    @Transactional public IncidentResponse create(IncidentRequest request) { return toResponse(incidents.save(new TrafficIncident(request.type(), request.location(), request.severity().toUpperCase(), request.description()))); }
    @Transactional public IncidentResponse update(long id, IncidentUpdateRequest request) {
        TrafficIncident incident = find(id); incident.update(request.severity().toUpperCase(), request.status().toUpperCase()); return toResponse(incident);
    }
    @Transactional public void delete(long id) { incidents.delete(find(id)); }
    private TrafficIncident find(long id) { return incidents.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Incident not found")); }
    private IncidentResponse toResponse(TrafficIncident i) {
        Instant created = i.getCreatedAt() == null ? Instant.now() : i.getCreatedAt();
        long minutes = Math.max(0, Duration.between(created, Instant.now()).toMinutes());
        String ago = minutes < 1 ? "just now" : minutes + " min ago";
        return new IncidentResponse(i.getId(), i.getType(), i.getLocation(), i.getSeverity(), i.getStatus(), ago, i.getDescription());
    }
}