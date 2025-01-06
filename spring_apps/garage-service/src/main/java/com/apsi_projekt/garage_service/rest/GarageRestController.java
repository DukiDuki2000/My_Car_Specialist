package com.apsi_projekt.garage_service.rest;

import com.apsi_projekt.garage_service.model.Garage;
import com.apsi_projekt.garage_service.model.GarageRequest;
import com.apsi_projekt.garage_service.service.GarageRequestService;
import com.apsi_projekt.garage_service.service.GarageService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("garage")
public class GarageRestController {

    GarageService garageService;
    private final GarageRequestService garageRequestService;
    @Autowired
    public GarageRestController(GarageService garageService,GarageRequestService garageRequestService) {
        this.garageRequestService = garageRequestService;
        this.garageService = garageService;
    }

    @GetMapping()
    public String sayHello() {
        return "Hello from Garage Service";
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ROLE_MODERATOR') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<Garage> add(@Valid @RequestBody Garage newGarage, HttpServletRequest request) {
        String usernameHeader = request.getHeader("X-Username");
        String idHeader = request.getHeader("X-Id");
        newGarage.setUserId(Long.parseLong(idHeader));
        newGarage.setUserName(usernameHeader);
        Garage savedGarage = garageService.addGarage(newGarage);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedGarage); // 201 - Created
    }

    @PreAuthorize("hasRole('ROLE_MODERATOR') or hasRole('ROLE_ADMIN')")
    @GetMapping("/allrequest")
    public ResponseEntity<List<GarageRequest>> getAllRequest() {
        List<GarageRequest> requests = garageRequestService.getAllRequests();
        if (requests.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(requests);
    }
    @PreAuthorize("hasRole('ROLE_MODERATOR') or hasRole('ROLE_ADMIN')")
    @DeleteMapping("/request/{nip}")
    public ResponseEntity<Void> deleteRequestByNip(@PathVariable String nip) {
        garageRequestService.deleteRequestByNip(nip);
        return ResponseEntity.ok().build();
    }
}
