package com.apsi_projekt.api_gateway.infrastructure.vehicle.client;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestTemplate;

@Service
public class RestVehicleServiceClient {
    private RestClient restClient;

    RestVehicleServiceClient(@Value("${service.vehicle_service}") String vehicleServiceUrl) {
        this.restClient = RestClient.create(vehicleServiceUrl);
    }

    public String getHello() {
        return restClient.get()
                .uri("vehicle")
                .retrieve()
                .body(new ParameterizedTypeReference<String>() {});
    }
}
