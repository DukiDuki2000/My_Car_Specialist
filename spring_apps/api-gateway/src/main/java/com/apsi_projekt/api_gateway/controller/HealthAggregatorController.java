package com.apsi_projekt.api_gateway.controller;


import org.springframework.boot.actuate.health.HealthComponent;
import org.springframework.boot.actuate.health.HealthEndpoint;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
public class HealthAggregatorController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final HealthEndpoint healthEndpoint;

    public HealthAggregatorController(HealthEndpoint healthEndpoint) {
        this.healthEndpoint = healthEndpoint;
    }

    // Lista serwisów + API Gateway
    private final Map<String, String> services = Map.of(// Sam gateway!
            "user-service", "http://user-service:8080/actuator/health",
            "garage-service", "http://garage-service:8080/actuator/health",
            "vehicle-service", "http://vehicle-service:8080/actuator/health",
            "notification-service", "http://notification-service:8080/actuator/health",
            "recommendation-service", "http://recommendation-service:8080/actuator/health"
    );

    @GetMapping
    public ResponseEntity<Map<String, Object>> aggregateHealth() {
        Map<String, Object> healthStatuses = new HashMap<>();

        HealthComponent gatewayHealth = healthEndpoint.health();
        healthStatuses.put("api-gateway", gatewayHealth.getStatus());

        services.forEach((serviceName, url) -> {
            try {
                ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
                healthStatuses.put(serviceName, response.getBody());
            } catch (Exception e) {
                healthStatuses.put(serviceName, Map.of("status", "DOWN", "error", e.getMessage()));
            }
        });

        return ResponseEntity.ok(healthStatuses);
    }
}
