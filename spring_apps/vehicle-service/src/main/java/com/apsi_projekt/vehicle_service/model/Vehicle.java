package com.apsi_projekt.vehicle_service.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "vehicles")
@Data
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="vin",nullable=false,updatable=false,unique=true)
    @NotBlank(message = "VIN cannot be blank")
    @Size(min = 17, max = 17, message = "VIN must be exactly 17 characters")
    @Pattern(regexp = "^[A-HJ-NPR-Z0-9]{17}$",
            message = "VIN must contain only letters (A-H, J-N, P, R-Z) and digits (0-9), excluding I, O, and Q")
    private String vin;

    @Column(name="registrationNumber",nullable=false,unique=true)
    private String registrationNumber;

    @NotBlank(message = "Brand cannot be blank")
    @Size(max = 50, message = "Brand length must be <= 50 characters")
    private String brand;

    @NotBlank(message = "Model cannot be blank")
    @Size(max = 50, message = "Model length must be <= 50 characters")
    private String model;

    @NotBlank(message = "Year cannot be blank")
    @NotNull(message = "Model cannot be null")
    @Pattern(regexp = "^\\d{4}$", message = "Production year must be 4 digits")
    private String modelYear;

    @NotBlank(message = "Year cannot be blank")
    @NotNull(message = "Model cannot be null")
    @Pattern(regexp = "^\\d{4}$", message = "Production year must be 4 digits")
    private String productionYear;

    @Size(max = 50, message = "Generation length must be <= 50 characters")
    private String generation;

    @Pattern(regexp = "^\\d{1,4}$", message = "Engine capacity must be 1 to 4 digits")
    private String engineCapacity;

    @Pattern(regexp = "^\\d{1,4}$", message = "Engine power must be 1 to 4 digits")
    private String enginePower;

    @Pattern(
            regexp = "^(gasoline|gasoline+CNG|gasoline+LPG|diesel|electric|hybrid|hybrid plug-in|etanol|hydrogen|petrol|petrol\\+CNG|petrol\\+LPG)$",
            flags = Pattern.Flag.CASE_INSENSITIVE,
            message = "Fuel type must be one of: gasoline,gasoline+CNG,gasoline+LPG, diesel, electric, hybrid,hybrid plug-in,etanol,hydrogen")
    private String fuelType;

    @Size(max = 50, message = "Engine code must be <= 50 characters")
    private String engineCode;

    @Size(max = 50, message = "Drive type must be <= 50 characters")
    private String driveType;

    private Long userId;
    private String userName;

    public void setVin(String vin) {
        this.vin = (vin == null) ? null : vin.toUpperCase();
    }
}
