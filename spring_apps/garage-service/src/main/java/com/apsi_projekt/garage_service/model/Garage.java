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
        @UniqueConstraint(columnNames = "regon"),
        @UniqueConstraint(columnNames = "userId"),
        @UniqueConstraint(columnNames = "userName")
        })
public class Garage {

    private @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    @NotBlank
    @NotNull
    @Size(min = 10, max = 10, message = "Nip length must be exactly 10")
    @Pattern(regexp = "\\d{10}")
    @Column(name = "nip", nullable = false, updatable = false, unique = true, length = 10)
    private String nip;

    @NotBlank
    @NotNull
    @Size(min = 7, max = 14, message = "REGON length must be 7 or 9 or 14")
    @Pattern(regexp = "^\\d{7}$|\\d{9}$|\\d{14}$")
    @Column(name = "regon", nullable = false, updatable = false, unique = true, length = 14)
    private String regon;

    @NotBlank
    @NotNull
    @Column(name = "companyName", nullable = false)
    private String companyName;


    @Embedded
    private Address address;

    @NotBlank
    @NotNull
    @Size(min = 9, max = 14)
    @Column(name = "phoneNumber", nullable = false, length = 20)
    private String phoneNumber;

    @NotNull
    @ElementCollection(fetch = FetchType.LAZY)
    @Column(name = "ibans", nullable = false, length = 35)
    private List<@NotBlank
        @Pattern(regexp = "^[A-Z0-9]{4,30}$")
        @Size(min = 15, max = 34)  String> ibans;

    @Column(name = "userId", unique = true)
    private Long userId;

    @Column(name = "userName", unique = true)
    private String userName;
}
