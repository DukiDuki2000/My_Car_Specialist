package com.apsi_projekt.api_gateway.infrastructure.garage.client;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class RestGarageServiceClient {
    private final RestClient restClient;

    RestGarageServiceClient (@Value("${services.garage_service}") String garageServiceUrl) {
        this.restClient = RestClient.create(garageServiceUrl);
    }

    public String getHello() {
        return restClient.get()
                .uri("garage")
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }
}
