package com.apsi_projekt.user_service.repositories;

import com.apsi_projekt.user_service.models.Role;
import com.apsi_projekt.user_service.models.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<UserRole, Long> {
    Optional<UserRole> findUserRoleByName(Role name);
}
