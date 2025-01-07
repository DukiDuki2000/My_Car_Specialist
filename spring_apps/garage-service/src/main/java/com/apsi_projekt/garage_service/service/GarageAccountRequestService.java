package com.apsi_projekt.garage_service.service;


import com.apsi_projekt.garage_service.model.GarageAccountRequest;
import com.apsi_projekt.garage_service.repositories.GarageAccountRequestRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class GarageAccountRequestService {

    private final GarageAccountRequestRepository garageAccountRequestRepository;


    public GarageAccountRequestService(GarageAccountRequestRepository garageAccountRequestRepository) {
        this.garageAccountRequestRepository = garageAccountRequestRepository;
    }

    public GarageAccountRequest addGarageRequest(GarageAccountRequest garageAccountRequest) {
        return garageAccountRequestRepository.save(garageAccountRequest);
    }

    public List<GarageAccountRequest> getAllRequests() {
        return garageAccountRequestRepository.findAll();
    }

    public void deleteRequestByNip(String nip) {
        Optional<GarageAccountRequest> requestOpt = garageAccountRequestRepository.findByNip(nip);
        if (requestOpt.isPresent()) {
            garageAccountRequestRepository.deleteByNip(nip);
        } else {
            throw new ResourceNotFoundException("GarageRequest with NIP " + nip + " not found.");
        }
    }
}
