package com.apsi_projekt.garage_service.service;

import com.apsi_projekt.garage_service.dto.AddGarageRequest;
import com.apsi_projekt.garage_service.dto.CompanyInfo;
import com.apsi_projekt.garage_service.dto.UserRequest;
import com.apsi_projekt.garage_service.model.Address;
import com.apsi_projekt.garage_service.model.Garage;
import com.apsi_projekt.garage_service.model.VATResposne;
import com.apsi_projekt.garage_service.repositories.GarageAccountRequestRepository;
import com.apsi_projekt.garage_service.repositories.GarageRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@Service
public class GarageService {

    private final RestTemplate restTemplate;
    private final String apiUrl = "https://wl-api.mf.gov.pl/api/search/nip/{nip}?date={date}";
    private final GarageRepository garageRepository;
    private final GarageAccountRequestRepository garageAccountRequestRepository;
    @Value("${API.SECRET.KEY}")
    String API_KEY;
    @Value("${API.USER-SERVICE}")
    String USER_SERVICE;

    @Autowired
    public GarageService(RestTemplate restTemplate, GarageRepository garageRepository, GarageAccountRequestRepository garageAccountRequestRepository) {
        this.restTemplate = restTemplate;
        this.garageRepository = garageRepository;
        this.garageAccountRequestRepository = garageAccountRequestRepository;
    }

    public CompanyInfo getCompanyInfoByNip(String nip) {
        String date = LocalDate.now().toString();

        VATResposne response = restTemplate.getForObject(apiUrl, VATResposne.class, nip, date);

        if (response != null && response.getResult() != null && response.getResult().getSubject() != null) {
            
            VATResposne.Subject subject = response.getResult().getSubject();
            return new CompanyInfo(
                    subject.getName(),
                    subject.getResidenceAddress(),
                    subject.getWorkingAddress(),
                    subject.getRegon(),
                    subject.getNip()
            );
        } else {
            throw new RuntimeException("Nie znaleziono danych dla NIP: " + nip);
        }
    }

    public List<String> getIbansByNip(String nip) {
        String date = LocalDate.now().toString();

        VATResposne response = restTemplate.getForObject(apiUrl, VATResposne.class, nip, date);

        if (response != null && response.getResult() != null && response.getResult().getSubject() != null) {

            VATResposne.Subject subject = response.getResult().getSubject();
            return subject.getIbans();
        } else {
            throw new RuntimeException("Nie znaleziono iban dla NIP: " + nip);
        }
    }

    public Garage registerGarage(AddGarageRequest addGarageRequest) {

        System.out.println("Registering garage started (1/9)");
        ResponseEntity<?> response = this.registerGarageUser(addGarageRequest);
        if (response.getStatusCode().is2xxSuccessful()) {
            try {
                System.out.println("User account created (3/9)");

                // Tworzenie garażu
                Garage newGarage = new Garage(
                        null,  // id zostanie ustawione automatycznie
                        addGarageRequest.getNip(),
                        addGarageRequest.getRegon(),
                        addGarageRequest.getCompanyName(),
                        this.parseAddress(addGarageRequest.getAddress()), // upewnij się, że adres jest prawidłowy
                        addGarageRequest.getPhoneNumber(),
                        this.getIbansByNip(addGarageRequest.getNip()),
                        this.getGarageUserId(addGarageRequest.getUsername()),
                        addGarageRequest.getUsername()
                );

                System.out.println("Created garage object: " + newGarage);

                try {
                    garageRepository.save(newGarage);
                } catch (DataIntegrityViolationException e) {
                    System.err.println("Data integrity violation: " + e.getMessage());
                    throw new RuntimeException("Data integrity violation while saving garage", e);
                } catch (Exception e) {
                    System.err.println("Error saving garage: " + e.getMessage());
                    throw new RuntimeException("Could not save garage", e);
                }

                return newGarage;
            } catch (Exception e) {
                throw new RuntimeException(e.getMessage());
            }
        } else {
            throw new RuntimeException("Error during garage registration: " + response.getBody());
        }
    }

    public static Address parseAddress(String address) {
        System.out.println("Parsing garage address (6/9)");
        String[] parts = address.split(",", 2);
        if (parts.length != 2) {
            throw new IllegalArgumentException("Invalid address format: " + address);
        }

        String street = parts[0].trim(); // Ulica i numer
        String[] postalCity = parts[1].trim().split(" ", 2); // Podział drugiej części po spacji

        if (postalCity.length != 2) {
            throw new IllegalArgumentException("Invalid postal code and city format: " + parts[1]);
        }

        String postalCode = postalCity[0].trim(); // Kod pocztowy
        String city = postalCity[1].trim();       // Miasto

        return new Address(street, postalCode, city);
    }

    public ResponseEntity<?> registerGarageUser(AddGarageRequest addGarageRequest) {
        System.out.println("Registering garage user account (2/9)");
        Set<String> roles = Collections.singleton("garage");
        UserRequest userRequest = new UserRequest(
                addGarageRequest.getUsername(),
                addGarageRequest.getEmail(),
                addGarageRequest.getPassword(),
                roles
        );

        HttpHeaders headers = new HttpHeaders();

        headers.set("X-API-KEY", API_KEY);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserRequest> entity = new HttpEntity<>(userRequest, headers);


        return restTemplate.exchange(
                USER_SERVICE + "/user/auth/signup",
                HttpMethod.POST,
                entity,
                String.class
        );
    }

    public Long getGarageUserId(String username) {
        System.out.println("Getting account Id (5/9)");
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-API-KEY", API_KEY);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Long> response = restTemplate.exchange(
                    USER_SERVICE + "/user/getId/" + username,
                    HttpMethod.GET,
                    entity,
                    Long.class
            );
            System.out.println(response.getBody());
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Error fetching userId: " + e.getMessage());
            throw new RuntimeException("Could not fetch userId for username: " + username, e);
        }
    }

    @Transactional
    public boolean deleteGarageAccountRequest(String nip) {
        int deleted = garageAccountRequestRepository.deleteByNip(nip);
        return deleted > 0;
    }

    public List<Garage> getAllGarages() {
        return garageRepository.findAll();
    }

}
