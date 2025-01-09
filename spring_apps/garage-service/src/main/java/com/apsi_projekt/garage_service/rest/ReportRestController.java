package com.apsi_projekt.garage_service.rest;

import com.apsi_projekt.garage_service.model.Report;
import com.apsi_projekt.garage_service.model.ReportStatus;
import com.apsi_projekt.garage_service.service.ReportService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("report")
public class ReportRestController {

    @Autowired
    private ReportService reportService;



    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('ROLE_CLIENT','ROLE_MODERATOR','ROLE_ADMIN')")
    public ResponseEntity<Report> createReport(@RequestBody Report report, HttpServletRequest request) {
        return ResponseEntity.ok(reportService.createReport(report, request));
    }


    @GetMapping("/user/reports")
    @PreAuthorize("hasAnyRole('ROLE_CLIENT','ROLE_MODERATOR','ROLE_ADMIN')")
    public ResponseEntity<List<Report>> getUserReports(HttpServletRequest request) {
        return ResponseEntity.ok(reportService.getAllUserReports(request));
    }


    @GetMapping("/garage/reports")
    @PreAuthorize("hasAnyRole('ROLE_GARAGE','ROLE_MODERATOR','ROLE_ADMIN')")
    public ResponseEntity<List<Report>> getAllGarageReports(HttpServletRequest request) {
        List<Report> reports = reportService.getAllGarageReports(request);
        return ResponseEntity.ok(reports);
    }


    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ROLE_MODERATOR','ROLE_ADMIN')")
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }


    @GetMapping("/all/new")
    @PreAuthorize("hasAnyRole('ROLE_GARAGE','ROLE_CLIENT','ROLE_MODERATOR','ROLE_ADMIN')")
    public ResponseEntity<List<Report>> getAllNewReports(HttpServletRequest request) {
        List<Report> reports = reportService.getAllStatusReports(request, "NEW");
        return ResponseEntity.ok(reports);
    }


    @GetMapping("/all/inprogress")
    @PreAuthorize("hasAnyRole('ROLE_GARAGE','ROLE_CLIENT','ROLE_MODERATOR','ROLE_ADMIN')")
    public ResponseEntity<List<Report>> getAllInProgressReports(HttpServletRequest request) {
        List<Report> reports = reportService.getAllStatusReports(request, "IN_PROGRESS");
        return ResponseEntity.ok(reports);
    }


    @GetMapping("/all/completed")
    @PreAuthorize("hasAnyRole('ROLE_GARAGE','ROLE_CLIENT','ROLE_MODERATOR','ROLE_ADMIN')")
    public ResponseEntity<List<Report>> getAllCompletedReports(HttpServletRequest request) {
        List<Report> reports = reportService.getAllStatusReports(request, "COMPLETED");
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/vehicle/{vehicleId}")
    @PreAuthorize("hasAnyRole('ROLE_GARAGE','ROLE_CLIENT','ROLE_MODERATOR','ROLE_ADMIN')")
    public ResponseEntity<List<Report>> getCompletedReportsByVehicleId(@PathVariable("vehicleId") Long vehicleId) {
        List<Report> reports = reportService.getCompletedReportsByVehicleId(vehicleId);
        return ResponseEntity.ok(reports);
    }

    @PutMapping("/status/{id}")
    @PreAuthorize("hasAnyRole('ROLE_GARAGE','ROLE_CLIENT','ROLE_MODERATOR','ROLE_ADMIN')")
    public ResponseEntity<Report> changeReportStatus(
            @PathVariable("id") Long reportId,
            @RequestParam("newStatus") ReportStatus newStatus) {
        Report updatedReport = reportService.changeReportStatus(reportId, newStatus);
        return ResponseEntity.ok(updatedReport);
    }


    @PostMapping("/operations/{id}")
    @PreAuthorize("hasAnyRole('ROLE_GARAGE','ROLE_MODERATOR','ROLE_ADMIN')")
    public ResponseEntity<Report> addOperationsToReport(
            @PathVariable("id") Long reportId,
            @RequestBody List<String> operations) {
        Report updatedReport = reportService.addOperationsToReport(reportId, operations);
        return ResponseEntity.ok(updatedReport);
    }



}
