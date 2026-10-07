package com.bengaluruflow.dto;

import java.util.List;

public record RouteResponse(int etaMinutes, List<String> route, int estimatedDelayMinutes, boolean simulated) { }