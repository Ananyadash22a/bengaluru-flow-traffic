package com.bengaluruflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bengaluruflow.entity.EmergencyRequest;

public interface EmergencyRequestRepository extends JpaRepository<EmergencyRequest, Long> { }