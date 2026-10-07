package com.bengaluruflow.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import com.bengaluruflow.dto.OptimizeRequest;
import com.bengaluruflow.dto.RouteResponse;
import com.bengaluruflow.entity.TrafficZone;
import com.bengaluruflow.repository.TrafficZoneRepository;

@Service
public class RoutePlannerService {
    private final TrafficZoneRepository zones;
    public RoutePlannerService(TrafficZoneRepository zones) { this.zones = zones; }
    public RouteResponse optimize(OptimizeRequest request) {
        List<List<String>> candidates = candidates(request.origin(), request.destination());
        List<String> best = candidates.stream().min((a,b) -> Integer.compare(cost(a), cost(b))).orElse(List.of(request.origin(), request.destination()));
        int delay = cost(best);
        int baseMinutes = Math.max(7, Math.round(best.size() * 5.5f));
        return new RouteResponse(baseMinutes + delay / 4, best, delay, true);
    }
    private List<List<String>> candidates(String origin, String destination) {
        String from = origin.trim(); String to = destination.trim();
        if (from.equalsIgnoreCase("Whitefield") && to.toLowerCase().contains("manipal")) {
            return List.of(List.of(from, "Marathahalli", to), List.of(from, "KR Puram", "Hebbal", to), List.of(from, "Indiranagar", "MG Road", to));
        }
        return List.of(List.of(from, "Marathahalli", to), List.of(from, "KR Puram", to));
    }
    private int cost(List<String> route) {
        List<TrafficZone> all = zones.findAll();
        int total = 0;
        for (String point : route) {
            total += all.stream().filter(zone -> zone.getName().equalsIgnoreCase(point)).findFirst()
                    .map(zone -> zone.getDelayMinutes() + zone.getCongestion() / 12).orElse(3);
        }
        return total;
    }
}