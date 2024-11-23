package com.apsi_projekt.vehicle_service.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("vehicle")
public class VehicleRestController {

    public VehicleRestController() {
    }

    @GetMapping()
    public String sayHello() {
        return "Hello from Vehicle Service";
    }
}
