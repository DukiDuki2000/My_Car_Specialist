package com.apsi_projekt.garage_service.repositories;

import com.apsi_projekt.garage_service.model.Report;
import com.apsi_projekt.garage_service.model.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByUserName(String userName);
    List<Report> findByGarage_UserId(Long garageId);
    List<Report> findByVehicleId(Long vehicleId);
    List<Report> findByStatusAndUserId(ReportStatus status, Long userId);
    List<Report> findByStatusAndVehicleId(ReportStatus status, Long vehicleId);
}
