package com.apsi_projekt.user_service.repositories;

import com.apsi_projekt.user_service.models.RefreshToken;
import com.apsi_projekt.user_service.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUser(User user);
    boolean existsByUser(User user);

    @Modifying
    int deleteByUser(User user);
}
