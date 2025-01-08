package com.apsi_projekt.garage_service.repositories;

import com.apsi_projekt.garage_service.model.GarageAccountRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GarageAccountRequestRepository extends JpaRepository<GarageAccountRequest, Long> {
    @Modifying
    int deleteByNip(String nip);

    Optional<GarageAccountRequest> findByNip(String nip);
}
