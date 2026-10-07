package com.bengaluruflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bengaluruflow.entity.TrafficIncident;

public interface TrafficIncidentRepository extends JpaRepository<TrafficIncident, Long> { }