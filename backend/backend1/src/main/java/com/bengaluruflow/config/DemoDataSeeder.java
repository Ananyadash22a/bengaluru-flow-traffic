package com.bengaluruflow.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.bengaluruflow.entity.TrafficIncident;
import com.bengaluruflow.entity.TrafficZone;
import com.bengaluruflow.repository.TrafficIncidentRepository;
import com.bengaluruflow.repository.TrafficZoneRepository;

@Component
public class DemoDataSeeder implements CommandLineRunner {
    private final TrafficZoneRepository zones;
    private final TrafficIncidentRepository incidents;
    public DemoDataSeeder(TrafficZoneRepository zones, TrafficIncidentRepository incidents) { this.zones = zones; this.incidents = incidents; }
    @Override public void run(String... args) {
        if (zones.count() == 0) {
            zones.save(new TrafficZone("Whitefield", 82, 14, 18, 78, 30));
            zones.save(new TrafficZone("Marathahalli", 94, 8, 26, 67, 45));
            zones.save(new TrafficZone("Silk Board", 91, 9, 24, 49, 77));
            zones.save(new TrafficZone("Electronic City", 56, 28, 8, 38, 92));
            zones.save(new TrafficZone("Indiranagar", 48, 32, 6, 59, 43));
            zones.save(new TrafficZone("Koramangala", 76, 17, 15, 51, 64));
            zones.save(new TrafficZone("Hebbal", 24, 48, 2, 46, 16));
            zones.save(new TrafficZone("KR Puram", 73, 19, 13, 72, 37));
            zones.save(new TrafficZone("Yeshwanthpur", 43, 33, 5, 35, 28));
            zones.save(new TrafficZone("MG Road", 62, 24, 9, 54, 49));
        }
        if (incidents.count() == 0) {
            incidents.save(new TrafficIncident("Accident", "Marathahalli Bridge", "HIGH", "Simulated collision report near the bridge."));
            incidents.save(new TrafficIncident("Signal failure", "Silk Board Junction", "MEDIUM", "Simulated signal outage on the westbound approach."));
            incidents.save(new TrafficIncident("Road construction", "Outer Ring Road", "LOW", "Simulated lane work near the service road."));
        }
    }
}