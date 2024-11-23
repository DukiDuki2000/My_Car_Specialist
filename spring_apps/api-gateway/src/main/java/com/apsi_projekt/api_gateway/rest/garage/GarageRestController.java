package com.apsi_projekt.api_gateway.rest.garage;

import com.apsi_projekt.api_gateway.infrastructure.garage.client.RestGarageServiceClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("garage")
public class GarageRestController {
    private final RestGarageServiceClient restGarageServiceClient;

    public GarageRestController(RestGarageServiceClient restGarageServiceClient) {
        this.restGarageServiceClient = restGarageServiceClient;
    }

    @GetMapping()
    public String getHello() {
        return restGarageServiceClient.getHello();
    }
}
