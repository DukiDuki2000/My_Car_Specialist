package com.apsi_projekt.api_gateway.infrastructure.user.client;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.beans.factory.annotation.Value;

@Service
public class RestUserServiceClient {
    private final RestClient restClient;

    RestUserServiceClient(@Value("${services.user_service}") String userServiceUrl) {
        this.restClient = RestClient.create(userServiceUrl);
    }

    public String getHello() {
        return restClient.get()
                .uri("user")
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }
}
