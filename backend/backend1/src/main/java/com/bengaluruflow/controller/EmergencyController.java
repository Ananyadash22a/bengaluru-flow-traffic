package com.bengaluruflow.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.bengaluruflow.dto.EmergencyRequestResponse;
import com.bengaluruflow.dto.OptimizeRequest;
import com.bengaluruflow.dto.VehicleResponse;
import com.bengaluruflow.service.EmergencyService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/emergency")
public class EmergencyController {
    private final EmergencyService emergency;
    public EmergencyController(EmergencyService emergency) { this.emergency = emergency; }
    @GetMapping("/vehicles") public List<VehicleResponse> vehicles() { return emergency.vehicles(); }
    @PostMapping("/request") @ResponseStatus(HttpStatus.CREATED) public EmergencyRequestResponse create(@Valid @RequestBody OptimizeRequest request) { return emergency.create(request); }
    @GetMapping("/requests/{id}") public EmergencyRequestResponse get(@PathVariable long id) { return emergency.get(id); }
}