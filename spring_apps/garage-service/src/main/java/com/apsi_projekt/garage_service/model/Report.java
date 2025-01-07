package com.apsi_projekt.garage_service.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;


@Data
@Entity
@Table(name="service_reports")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name="created_at", nullable=false)
    private LocalDate createdAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name="garage_id",nullable=false)
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
    @Column(name = "operations", nullable = false)
    private List<@NotBlank String> operations;

    private Long userId;
    private String userName;
}




