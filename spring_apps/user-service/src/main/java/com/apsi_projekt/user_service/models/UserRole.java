package com.apsi_projekt.user_service.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Entity
@Table(name = "roles")
public class UserRole {
    private @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) Integer id;
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Role name;
}
