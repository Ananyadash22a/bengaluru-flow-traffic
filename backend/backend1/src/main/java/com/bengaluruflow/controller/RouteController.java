package com.bengaluruflow.controller;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bengaluruflow.dto.OptimizeRequest;
import com.bengaluruflow.dto.RouteResponse;
import com.bengaluruflow.service.RoutePlannerService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/routes")
public class RouteController {
    private final RoutePlannerService planner;
    public RouteController(RoutePlannerService planner) { this.planner = planner; }
    @GetMapping public List<Map<String, Object>> getRoutes() {
        return List.of(Map.of("id", "ORR-EAST", "name", "Outer Ring Road East", "status", "SIMULATED"), Map.of("id", "CBD-CENTRAL", "name", "Central Business District", "status", "SIMULATED"));
    }
    @PostMapping("/optimize") public RouteResponse optimize(@Valid @RequestBody OptimizeRequest request) { return planner.optimize(request); }
}