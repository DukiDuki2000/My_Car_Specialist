package com.apsi_projekt.api_gateway.infrastructure.user.client;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.beans.factory.annotation.Value;

@Service
public class RestUserServiceClient {
    private final RestClient restClient;

    RestUserServiceClient(@Value("${service.garage_service}") String userURL) {
        this.restClient = RestClient.create(userURL);
    }

    public String getHello() {
        return restClient.get()
                .uri("user")
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }
}
