package com.bengaluruflow.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bengaluruflow.entity.TrafficZone;

public interface TrafficZoneRepository extends JpaRepository<TrafficZone, Long> {
    Optional<TrafficZone> findByNameIgnoreCase(String name);
}