package com.apsi_projekt.garage_service.rest;

import com.apsi_projekt.garage_service.dto.AddGarageRequest;
import com.apsi_projekt.garage_service.dto.UserInfo;
import com.apsi_projekt.garage_service.model.Garage;
import com.apsi_projekt.garage_service.model.GarageAccountRequest;
import com.apsi_projekt.garage_service.service.GarageAccountRequestService;
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
    private final GarageAccountRequestService garageAccountRequestService;
    @Autowired
    public GarageRestController(GarageService garageService, GarageAccountRequestService garageAccountRequestService) {
        this.garageAccountRequestService = garageAccountRequestService;
        this.garageService = garageService;
    }

    @GetMapping()
    public String sayHello() {
        return "Hello from Garage Service";
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('ROLE_MODERATOR') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> add(@Valid @RequestBody AddGarageRequest addGarageRequest) {
        Garage savedGarage = garageService.registerGarage(addGarageRequest);
        System.out.println("Garage registered (8/9)");
        garageService.deleteGarageAccountRequest(savedGarage.getNip());
        System.out.println("Request associated with the created account has been successfully deleted. (9/9)");
        return ResponseEntity.status(HttpStatus.CREATED).body(savedGarage); // 201 - Created
    }

    @PreAuthorize("hasRole('ROLE_MODERATOR') or hasRole('ROLE_ADMIN')")
    @GetMapping("/request/all")
    public ResponseEntity<List<GarageAccountRequest>> getAllRequest() {
        List<GarageAccountRequest> requests = garageAccountRequestService.getAllRequests();
        if (requests.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(requests);
    }
    @PreAuthorize("hasRole('ROLE_MODERATOR') or hasRole('ROLE_ADMIN')")
    @DeleteMapping("/request/{nip}")
    public ResponseEntity<Void> deleteRequestByNip(@PathVariable String nip) {
        garageAccountRequestService.deleteRequestByNip(nip);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ROLE_MODERATOR','ROLE_ADMIN','ROLE_GARAGE', 'ROLE_CLIENT')")
    public ResponseEntity<List<Garage>> getAllGarages() {
        List<Garage> garages = garageService.getAllGarages();
        if (garages.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(garages);
    }

    @GetMapping("/all/byCity/{city}")
    public List<Garage> getAllByGivenCityAndSortByStreet(@PathVariable String city) {
        return garageService.getAllByGivenCityAndSortByStreet(city);
    }

    @GetMapping("/info")
    @PreAuthorize("hasAnyRole('ROLE_GARAGE','ROLE_MODERATOR','ROLE_ADMIN')")
    public ResponseEntity<Garage> getGarageByUserId(HttpServletRequest request) {
        String idHeader = request.getHeader("X-Id");
        Garage garage = garageService.getGarageByUserId(Long.parseLong(idHeader));
        return ResponseEntity.ok(garage);
    }
    @PutMapping("/change/phone")
    @PreAuthorize("hasAnyRole('ROLE_GARAGE','ROLE_MODERATOR','ROLE_ADMIN')")
    public ResponseEntity<Garage> updatePhoneNumber(HttpServletRequest request,
                                                    @RequestParam String phoneNumber) {
        String idHeader = request.getHeader("X-Id");
        Garage updatedGarage = garageService.updatePhoneNumber(Long.parseLong(idHeader), phoneNumber);
        return ResponseEntity.ok(updatedGarage);
    }
}
