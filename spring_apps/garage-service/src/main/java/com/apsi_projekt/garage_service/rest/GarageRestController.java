package com.apsi_projekt.garage_service.rest;

import com.apsi_projekt.garage_service.model.Garage;
import com.apsi_projekt.garage_service.service.GarageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("garage")
public class GarageRestController {

    GarageService garageService;

    @Autowired
    public GarageRestController(GarageService garageService) {
        this.garageService = garageService;
    }

    @GetMapping()
    public String sayHello() {
        return "Hello from Garage Service";
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ROLE_MODERATOR') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<Garage> add(@Valid @RequestBody Garage newGarage) {
        Garage savedGarage = garageService.addGarage(newGarage);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedGarage); // 201 - Created
    }
}
