package com.apsi_projekt.garage_service.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Data
@Entity
@Table(name="service_reports")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "report_dates",
            joinColumns = @JoinColumn(name = "report_id")
    )
    @Column(name = "date", nullable = false)
    private List<@NotNull LocalDateTime> dateHistory = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name="garage_id", nullable=false)
    private Garage garage;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name="status", nullable=false)
    private ReportStatus status;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "report_operations",
            joinColumns = @JoinColumn(name = "service_report_id")
    )

    @Column(name = "operations")
    private List<@NotBlank String> operations;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "report_operation_dates",
            joinColumns = @JoinColumn(name = "report_id")
    )
    @Column(name = "operation_date", nullable = false)
    private List<@NotNull LocalDateTime> operationDates = new ArrayList<>();

    @NotNull
    @Column(name = "vehicle_id", nullable = false)
    private Long vehicleId;

    private Long userId;
    private String userName;

    @Column(name="description",nullable=false)
    private String description;

    @PrePersist
    protected void onCreate() {

        this.dateHistory.add(LocalDateTime.now());
        this.createdAt = LocalDateTime.now();
    }


    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "report_service_amount",
            joinColumns = @JoinColumn(name = "service_report_id")
    )
    @Column(name="amount", nullable = false)
    private List<Double> amounts = new ArrayList<>();


}




