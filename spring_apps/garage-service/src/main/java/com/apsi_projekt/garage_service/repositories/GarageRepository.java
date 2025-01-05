package com.apsi_projekt.garage_service.repositories;

import com.apsi_projekt.garage_service.model.Garage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GarageRepository extends JpaRepository<Garage, Long> {
    Garage findByNip(String nip);
}
