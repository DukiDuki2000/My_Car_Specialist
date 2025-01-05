package com.apsi_projekt.garage_service.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
@Entity
@Table (name = "garages", uniqueConstraints = {
        @UniqueConstraint(columnNames = "nip"),
        @UniqueConstraint(columnNames = "regon")
        })
public class Garage {

    private @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long Id;

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

    @NotNull
    @ElementCollection(fetch = FetchType.LAZY)
    @Column(name = "ibans", nullable = false, length = 35)
    List<@NotBlank
        @Pattern(regexp = "^[A-Z]{2}\\d{2}[A-Z0-9]{4,30}$")
        @Size(min = 15, max = 34) String> ibans;
}
