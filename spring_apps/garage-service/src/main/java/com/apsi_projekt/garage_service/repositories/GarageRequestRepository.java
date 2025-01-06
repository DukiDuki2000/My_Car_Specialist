package com.apsi_projekt.garage_service.repositories;

import com.apsi_projekt.garage_service.model.GarageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GarageRequestRepository extends JpaRepository<GarageRequest, Long> {
    @Modifying
    @Query("DELETE FROM GarageRequest gr WHERE gr.nip = :nip")
    void deleteByNip(@Param("nip") String nip);

    Optional<GarageRequest> findByNip(String nip);
}
