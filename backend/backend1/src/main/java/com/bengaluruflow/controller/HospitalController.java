package com.bengaluruflow.controller;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bengaluruflow.dto.HospitalResponse;
import com.bengaluruflow.service.EmergencyService;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {
    private final EmergencyService emergency;
    public HospitalController(EmergencyService emergency) { this.emergency = emergency; }
    @GetMapping public List<HospitalResponse> getAll() { return emergency.hospitals(); }
}