package com.apsi_projekt.api_gateway.infrastructure.notification.client;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class RestNotificationServiceClient {
    private final RestClient restClient;

    RestNotificationServiceClient(@Value("${services.notification_service}") String notificationServiceUrl) {
        this.restClient = RestClient.create(notificationServiceUrl);
    }

    public String getHello() {
        return restClient.get()
                .uri("notification")
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }
}
