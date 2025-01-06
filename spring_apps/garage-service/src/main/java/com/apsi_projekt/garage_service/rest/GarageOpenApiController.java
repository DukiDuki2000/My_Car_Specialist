package com.apsi_projekt.garage_service.rest;

import com.apsi_projekt.garage_service.dto.CompanyInfo;
import com.apsi_projekt.garage_service.service.GarageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("garage/openApi")
public class GarageOpenApiController {

    @Value("${API.SECRET.KEY}")
    String API_KEY;

    private final GarageService garageService;
    private final RestTemplate restTemplate;

    public GarageOpenApiController(GarageService garageService, RestTemplateBuilder builder) {
        this.garageService = garageService;
        this.restTemplate = builder.build();
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

    @GetMapping("/test")
    public ResponseEntity<String> getAllCompanyInfos() {
        try {
            HttpHeaders headers = new HttpHeaders();

            headers.set("X-API-KEY", API_KEY);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    "http://user-service:8080/user/openApi",
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            return ResponseEntity.ok(response.getBody());
        } catch (RestClientException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(e.getMessage());
        }
    }

}
