package com.apsi_projekt.api_gateway.infrastructure.user.client;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class RestUserServiceClient {
    private final RestClient restClient;

    RestUserServiceClient() {
        this.restClient = RestClient.create("http://localhost:8081");
    }

    public String getHello() {
        return restClient.get()
                .uri("user")
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }
}
