package com.apsi_projekt.garage_service.service;

import com.apsi_projekt.garage_service.model.Report;
import com.apsi_projekt.garage_service.model.ReportStatus;
import com.apsi_projekt.garage_service.repositories.ReportRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    public Report createReport(Report report,HttpServletRequest request) {
        String usernameHeader = request.getHeader("X-Username");
        String idHeader = request.getHeader("X-Id");
        report.setUserName(usernameHeader);
        report.setUserId(Long.parseLong(idHeader));
        if (report.getStatus() == null){
            report.setStatus(ReportStatus.NEW);
        }
        return reportRepository.save(report);
    }


    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }


    public List<Report> getAllUserReports(HttpServletRequest request) {
        String usernameHeader = request.getHeader("X-Username");
        return reportRepository.findByUserName(usernameHeader);
    }


    public List<Report> getAllGarageReports(HttpServletRequest request){
        String garageId = request.getHeader("X-Id");
        return reportRepository.findByGarageId(Long.parseLong(garageId));
    }

    public List<Report> getAllStatusReports(HttpServletRequest request, String statusStr){
        String usergarageId = request.getHeader("X-Id");
        ReportStatus status;
        try {
            status = ReportStatus.valueOf(statusStr.toUpperCase().replace("-", "_"));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status value: " + statusStr);
        }
        return reportRepository.findByStatusAndUserId(status,Long.parseLong(usergarageId));
    }
    public Report changeReportStatus(Long reportId, ReportStatus newStatus) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Not found ID: " + reportId));
        ReportStatus currentStatus = report.getStatus();
        if (currentStatus == newStatus) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Report already has status: " + currentStatus);
        }
        switch (currentStatus) {
            case NEW:
                if (newStatus != ReportStatus.IN_PROGRESS) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "From NEW status, you can only transition to IN_PROGRESS.");
                }
                break;
            case IN_PROGRESS:
                if (newStatus != ReportStatus.COMPLETED) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "From IN_PROGRESS status, you can only transition to COMPLETED.");
                }
                break;
            case COMPLETED:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "COMPLETED status is final and cannot be changed");
            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid current status: " + currentStatus);
        }

        report.setStatus(newStatus);
        report.getDateHistory().add(LocalDateTime.now());
        return reportRepository.save(report);
    }


    public Report addOperationsToReport(Long reportId, List<String> operations) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("\n" +
                        "Service report not found with ID: " + reportId));

        LocalDateTime now = LocalDateTime.now();
        for (String operation : operations) {
            report.getOperations().add(operation);
            report.getOperationDates().add(now);
        }

        report.getDateHistory().add(now);

        return reportRepository.save(report);
    }

    @PreAuthorize("hasAnyRole('ROLE_MODERATOR','ROLE_ADMIN','ROLE_GARAGE','ROLE_USER')")
    public List<Report> getCompletedReportsByVehicleId(Long vehicleId) {
        return reportRepository.findByStatusAndVehicleId(ReportStatus.COMPLETED,vehicleId);
    }
}
