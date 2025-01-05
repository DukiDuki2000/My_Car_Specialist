package com.apsi_projekt.vehicle_service.model;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "vehicles")
@Data
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vin;
    private String registrationNumber;
    private String brand;
    private String model;
    private String modelYear;
    private String productionYear;
    private String generation;
    private String engineCapacity;
    private String enginePower;
    private String fuelType;
    private String engineCode;
    private String driveType;
    private String userId;
    private String userName;
}
