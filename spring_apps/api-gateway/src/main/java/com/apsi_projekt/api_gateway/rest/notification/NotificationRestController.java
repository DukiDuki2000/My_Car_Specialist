package com.apsi_projekt.api_gateway.rest.notification;

import com.apsi_projekt.api_gateway.infrastructure.notification.client.RestNotificationServiceClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("notification")
public class NotificationRestController {
    private final RestNotificationServiceClient restNotificationServiceClient;

    public NotificationRestController(RestNotificationServiceClient restNotificationServiceClient) {
        this.restNotificationServiceClient = restNotificationServiceClient;
    }

    @GetMapping()
    public String getHello() {
        return restNotificationServiceClient.getHello();
    }
}
