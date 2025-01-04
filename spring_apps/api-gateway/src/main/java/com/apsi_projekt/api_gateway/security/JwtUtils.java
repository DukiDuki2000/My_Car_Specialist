package com.apsi_projekt.api_gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String secret;

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    public Claims getClaims(String token){
        try {
            Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            // Logowanie błędu lub odpowiednia obsługa
            throw new JwtException("Token is invalid or expired: " + e.getMessage());
        }
    }
    public boolean isTokenExpired(String token) {
        Claims claims = this.getClaims(token);
        System.out.println(claims);
        return claims.getExpiration().before(new Date());
    }

    public boolean isValid(String token) {
        return !this.isTokenExpired(token);
    }

    public List<String> getRoles(String token) {
        Claims claims = this.getClaims(token);
        List<Map<String, String>> roles = claims.get("Roles", List.class);
        return roles.stream()
                .map(role -> role.get("authority"))
                .collect(Collectors.toList());
    }
}
