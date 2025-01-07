package com.apsi_projekt.garage_service.repositories;

import com.apsi_projekt.garage_service.model.GarageAccountRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface GarageAccountRequestRepository extends JpaRepository<GarageAccountRequest, Long> {
    @Modifying
    @Query("DELETE FROM GarageAccountRequest gr WHERE gr.nip = :nip")
    void deleteByNip(@Param("nip") String nip);

    Optional<GarageAccountRequest> findByNip(String nip);
}
