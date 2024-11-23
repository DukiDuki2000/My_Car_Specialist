package com.apsi_projekt.api_gateway.rest.vehicle;

import com.apsi_projekt.api_gateway.infrastructure.vehicle.client.RestVehicleServiceClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("vehicle")
public class VehicleRestController {
    private final RestVehicleServiceClient restVehicleServiceClient;

    public VehicleRestController(RestVehicleServiceClient restVehicleServiceClient) {
        this.restVehicleServiceClient = restVehicleServiceClient;
    }

    @GetMapping()
    public String getHello() {
        return restVehicleServiceClient.getHello();
    }
}
