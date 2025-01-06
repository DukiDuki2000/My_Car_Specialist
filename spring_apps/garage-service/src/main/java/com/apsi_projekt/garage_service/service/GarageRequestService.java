package com.apsi_projekt.garage_service.service;


import com.apsi_projekt.garage_service.model.GarageRequest;
import com.apsi_projekt.garage_service.repositories.GarageRequestRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class GarageRequestService {

    private final GarageRequestRepository garageRequestRepository;


    public GarageRequestService(GarageRequestRepository garageRequestRepository) {
        this.garageRequestRepository = garageRequestRepository;
    }

    public GarageRequest addGarageRequest(GarageRequest garageRequest) {
        return garageRequestRepository.save(garageRequest);
    }

    public List<GarageRequest> getAllRequests() {
        return garageRequestRepository.findAll();
    }

    public void deleteRequestByNip(String nip) {
        Optional<GarageRequest> requestOpt = garageRequestRepository.findByNip(nip);
        if (requestOpt.isPresent()) {
            garageRequestRepository.deleteByNip(nip);
        } else {
            throw new ResourceNotFoundException("GarageRequest with NIP " + nip + " not found.");
        }
    }
}
