package com.apsi_projekt.garage_service.repositories;

import com.apsi_projekt.garage_service.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByUserName(String userName);
    List<Report> findbyGarageId(Long id);

}
