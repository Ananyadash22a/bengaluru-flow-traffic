package com.bengaluruflow.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.bengaluruflow.dto.IncidentRequest;
import com.bengaluruflow.dto.IncidentResponse;
import com.bengaluruflow.dto.IncidentUpdateRequest;
import com.bengaluruflow.service.IncidentService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {
    private final IncidentService incidents;
    public IncidentController(IncidentService incidents) { this.incidents = incidents; }
    @GetMapping public List<IncidentResponse> getAll() { return incidents.getAll(); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public IncidentResponse create(@Valid @RequestBody IncidentRequest request) { return incidents.create(request); }
    @PutMapping("/{id}") public IncidentResponse update(@PathVariable long id, @Valid @RequestBody IncidentUpdateRequest request) { return incidents.update(id, request); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable long id) { incidents.delete(id); }
}