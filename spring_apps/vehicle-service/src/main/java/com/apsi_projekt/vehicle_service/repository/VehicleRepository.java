package com.apsi_projekt.vehicle_service.repository;

import com.apsi_projekt.vehicle_service.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface VehicleRepository extends JpaRepository<Vehicle,Long> {
    Optional<Vehicle> findByVin(String vin);
    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);
    List<Vehicle> findByUserName(String userName);
    List<Vehicle> findByUserId(Long userId);
}
