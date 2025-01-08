package com.apsi_projekt.garage_service.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class Address {
    @NotBlank(message = "Street cannot be empty")
    @Size(max = 255, message = "Street must be at most 255 characters long")
    private String street; // Ulica i numer

    @NotBlank(message = "Postal code cannot be empty")
    @Pattern(regexp = "\\d{2}-\\d{3}", message = "Postal code must match the pattern 'XX-XXX'")
    private String postalCode; // Kod pocztowy

    @NotBlank(message = "City cannot be empty")
    @Size(max = 100, message = "City must be at most 100 characters long")
    private String city;
}
