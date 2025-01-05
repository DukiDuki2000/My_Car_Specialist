package com.apsi_projekt.garage_service.service;

import com.apsi_projekt.garage_service.dto.CompanyInfo;
import com.apsi_projekt.garage_service.model.Garage;
import com.apsi_projekt.garage_service.model.VATResposne;
import com.apsi_projekt.garage_service.repositories.GarageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;

@Service
public class GarageService {

    private final RestTemplate restTemplate;
    private final String apiUrl = "https://wl-api.mf.gov.pl/api/search/nip/{nip}?date={date}";
    private GarageRepository garageRepository;

    public GarageService(RestTemplate restTemplate, GarageRepository garageRepository) {
        this.restTemplate = restTemplate;
        this.garageRepository = garageRepository;
    }

    @Autowired
    public GarageService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
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

    public Garage addGarage(Garage newGarage) {
        return garageRepository.save(newGarage);
    }
}
