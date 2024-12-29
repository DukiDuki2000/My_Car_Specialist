package com.apsi_projekt.garage_service.rest;

import com.apsi_projekt.garage_service.dto.CompanyInfo;
import com.apsi_projekt.garage_service.service.GarageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("garage")
public class GarageRestController {

    private final GarageService garageService;


    public GarageRestController(GarageService garageService) {
        this.garageService = garageService;
    }

    @GetMapping()
    public String sayHello() {
        return "Hello from Garage Service";
    }

    @GetMapping("/{nip}")
    public ResponseEntity<CompanyInfo> getFirmaInfoByNip(@PathVariable String nip) {

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
}
