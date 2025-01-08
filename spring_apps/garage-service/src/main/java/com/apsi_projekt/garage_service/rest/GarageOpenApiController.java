package com.apsi_projekt.garage_service.rest;

import com.apsi_projekt.garage_service.dto.CompanyInfo;
import com.apsi_projekt.garage_service.model.GarageAccountRequest;
import com.apsi_projekt.garage_service.service.GarageAccountRequestService;
import com.apsi_projekt.garage_service.service.GarageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("garage/openApi")
public class GarageOpenApiController {

    @Value("${API.SECRET.KEY}")
    String API_KEY;

    private final GarageService garageService;
    private final GarageAccountRequestService garageAccountRequestService;
    private final RestTemplate restTemplate;

    public GarageOpenApiController(GarageService garageService, GarageAccountRequestService garageAccountRequestService, RestTemplateBuilder builder) {
        this.garageService = garageService;
        this.garageAccountRequestService = garageAccountRequestService;
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
    public ResponseEntity<Long> getAllCompanyInfos() {
        try {
            HttpHeaders headers = new HttpHeaders();

            headers.set("X-API-KEY", API_KEY);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Long> response = restTemplate.exchange(
                    "http://user-service:8080/user/getId/supergarage",
                    HttpMethod.GET,
                    entity,
                    Long.class
            );

            return ResponseEntity.ok(response.getBody());
        } catch (RestClientException e) {
            throw new RuntimeException();
        }
    }

    @PostMapping("/add_request")
    public ResponseEntity<GarageAccountRequest> addGarageRequest(@Valid @RequestBody GarageAccountRequest garageAccountRequest) {
        GarageAccountRequest savedGarageAccountRequest = garageAccountRequestService.addGarageRequest(garageAccountRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedGarageAccountRequest);
    }
}
