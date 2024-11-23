package com.apsi_projekt.api_gateway.rest.user;

import com.apsi_projekt.api_gateway.infrastructure.user.client.RestUserServiceClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("user")
public class UserRestController {
    private final RestUserServiceClient restUserServiceClient;

    public UserRestController(RestUserServiceClient restUserServiceClient) {
        this.restUserServiceClient = restUserServiceClient;
    }

    @GetMapping
    public String getHello() {
        return restUserServiceClient.getHello();
    }
}
