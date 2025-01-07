package com.apsi_projekt.garage_service.service;

import com.apsi_projekt.garage_service.model.Report;
import com.apsi_projekt.garage_service.model.ReportStatus;
import com.apsi_projekt.garage_service.repositories.ReportRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    public Report createReport(Report report,HttpServletRequest request) {
        String usernameHeader = request.getHeader("X-Username");
        String idHeader = request.getHeader("X-Id");

        if (report.getStatus() == null){
            report.setStatus(ReportStatus.NEW);
        }
        return reportRepository.save(report);
    }

    @PreAuthorize("hasAnyRole('ROLE_MODERATOR','ROLE_ADMIN')")
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    @PreAuthorize("hasAnyRole('ROLE_USER')")
    public List<Report> getAllUserReports(Report report,HttpServletRequest request) {
        String usernameHeader = request.getHeader("X-Username");
        String idHeader = request.getHeader("X-Id");
        report.setUserName(usernameHeader);
        report.setUserId(Long.parseLong(idHeader));
        return reportRepository.findByUserName(usernameHeader);
    }

    @PreAuthorize("hasAnyRole('ROLE_GARAGE')")
    public List<Report> getAllGarageReports(Report report){
        return reportRepository.findbyGarageId(report.getGarage().getId());
    }

    @PreAuthorize("hasAnyRole('ROLE_MODERATOR','ROLE_ADMIN','ROLE_GARAGE','ROLE_USER')")
    public Report changeReportStatus(Long reportId, ReportStatus newStatus) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Not found ID: " + reportId));
        report.setStatus(newStatus);
        return reportRepository.save(report);
    }

    //Edycja


}
