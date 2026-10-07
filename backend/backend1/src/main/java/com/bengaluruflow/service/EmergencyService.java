package com.bengaluruflow.service;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.bengaluruflow.dto.EmergencyRequestResponse;
import com.bengaluruflow.dto.HospitalResponse;
import com.bengaluruflow.dto.OptimizeRequest;
import com.bengaluruflow.dto.RouteResponse;
import com.bengaluruflow.dto.VehicleResponse;
import com.bengaluruflow.entity.EmergencyRequest;
import com.bengaluruflow.repository.EmergencyRequestRepository;

@Service
public class EmergencyService {
    private final EmergencyRequestRepository requests;
    private final RoutePlannerService routePlanner;
    public EmergencyService(EmergencyRequestRepository requests, RoutePlannerService routePlanner) { this.requests = requests; this.routePlanner = routePlanner; }
    public List<VehicleResponse> vehicles() {
        return List.of(new VehicleResponse("AMB-102", "AMBULANCE", "Whitefield", "AVAILABLE"), new VehicleResponse("AMB-118", "AMBULANCE", "Indiranagar", "AVAILABLE"),
                new VehicleResponse("FIRE-04", "FIRE", "Hebbal", "AVAILABLE"), new VehicleResponse("AMB-121", "AMBULANCE", "Koramangala", "EN_ROUTE"),
                new VehicleResponse("PCR-17", "PATROL", "MG Road", "AVAILABLE"), new VehicleResponse("AMB-131", "AMBULANCE", "Electronic City", "AVAILABLE"), new VehicleResponse("PCR-22", "PATROL", "KR Puram", "AVAILABLE"));
    }
    public List<HospitalResponse> hospitals() {
        return List.of(new HospitalResponse("Manipal Hospital", "Whitefield", "MULTISPECIALTY", 77, 32), new HospitalResponse("St. John's Medical College", "Koramangala", "EMERGENCY", 53, 67),
                new HospitalResponse("Aster CMI Hospital", "Hebbal", "MULTISPECIALTY", 45, 17), new HospitalResponse("Narayana Health City", "Electronic City", "TRAUMA", 38, 92));
    }
    @Transactional public EmergencyRequestResponse create(OptimizeRequest request) {
        RouteResponse route = routePlanner.optimize(request);
        EmergencyRequest saved = requests.save(new EmergencyRequest(request.origin(), request.destination(), request.priority().toUpperCase(), route.etaMinutes(), String.join(" -> ", route.route())));
        return toResponse(saved);
    }
    @Transactional(readOnly = true) public EmergencyRequestResponse get(long id) {
        EmergencyRequest request = requests.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Emergency request not found"));
        return toResponse(request);
    }
    private EmergencyRequestResponse toResponse(EmergencyRequest r) { return new EmergencyRequestResponse(r.getId(), r.getOrigin(), r.getDestination(), r.getPriority(), r.getEtaMinutes(), r.getRecommendedRoute(), r.getCreatedAt()); }
}