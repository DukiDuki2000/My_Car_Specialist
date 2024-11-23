package com.apsi_projekt.api_gateway.infrastructure.garage.client;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class RestGarageServiceClient {
    private final RestClient restClient;

    RestGarageServiceClient () {
        this.restClient = RestClient.create("http://garage-service:8080");
    }

    public String getHello() {
        return restClient.get()
                .uri("garage")
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }
}
