package com.apsi_projekt.garage_service.rest;

import com.apsi_projekt.garage_service.dto.CompanyInfo;
import com.apsi_projekt.garage_service.model.GarageRequest;
import com.apsi_projekt.garage_service.service.GarageRequestService;
import com.apsi_projekt.garage_service.service.GarageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("garage/openApi")
public class GarageOpenApiController {

    private final GarageService garageService;
    private final GarageRequestService garageRequestService;

    public GarageOpenApiController(GarageService garageService, GarageRequestService garageRequestService) {
        this.garageService = garageService;
        this.garageRequestService = garageRequestService;
    }

    @GetMapping("/{nip}")
    public ResponseEntity<CompanyInfo> getFirmaInfoByNip(@PathVariable String nip) {
        System.out.println("Recieved request with nip: " + nip);
        if (!nip.matches("\\d{10}")) {
            return ResponseEntity.badRequest().body(null);
        }

        try {
            CompanyInfo companyInfo = garageService.getCompanyInfoByNip(nip);
            return ResponseEntity.ok(companyInfo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    @PostMapping("/add_request")
    public ResponseEntity<GarageRequest> addGarageRequest(@Valid @RequestBody GarageRequest garageRequest) {
        GarageRequest savedGarageRequest=garageRequestService.addGarageRequest(garageRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedGarageRequest);
    }

}
