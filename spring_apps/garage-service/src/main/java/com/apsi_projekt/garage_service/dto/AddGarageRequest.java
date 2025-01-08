package com.apsi_projekt.garage_service.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AddGarageRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(min = 3, max = 40)
    private String password;

    @NotBlank
    @NotNull
    @Size(min = 10, max = 10, message = "Nip length must be exactly 10")
    @Pattern(regexp = "\\d{10}")
    @Column(name = "nip", nullable = false, updatable = false, unique = true, length = 10)
    String nip;

    @NotBlank
    @NotNull
    @Size(min = 7, max = 14, message = "REGON length must be 7 or 9 or 14")
    @Pattern(regexp = "^\\d{7}$|\\d{9}$|\\d{14}$")
    @Column(name = "regon", nullable = false, updatable = false, unique = true, length = 14)
    String regon;

    @NotBlank
    @NotNull
    @Column(name = "comp_name", nullable = false)
    String companyName;

    @NotBlank
    @NotNull
    @Column(name = "address", nullable = false)
    String address;

    @NotBlank
    @NotNull
    @Size(min = 9, max = 14)
    @Column(name = "phone_number", nullable = false, length = 20)
    String phoneNumber;
}
