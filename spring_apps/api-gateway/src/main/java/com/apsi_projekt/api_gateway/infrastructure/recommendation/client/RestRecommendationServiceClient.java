package com.apsi_projekt.api_gateway.infrastructure.recommendation.client;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class RestRecommendationServiceClient {
    private final RestClient restClient;

    RestRecommendationServiceClient() {
        this.restClient = RestClient.create("http://localhost:8081");
    }

    public String getHello() {
        return restClient.get()
                .uri("recommendation")
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }
}
