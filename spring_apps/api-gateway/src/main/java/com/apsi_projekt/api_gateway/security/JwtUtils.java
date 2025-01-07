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
        if (secret == null) {
            throw new IllegalArgumentException("JWT secret key is empty.");
        }

        Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public List<String> getRoles(String token) {
        Claims claims = this.getClaims(token);
        List<Map<String, String>> roles = claims.get("Roles", List.class);
        return roles.stream()
                .map(role -> role.get("authority"))
                .collect(Collectors.toList());
    }
    public String getUsername(String token) {
        Claims claims = this.getClaims(token);
        return claims.getSubject();
    }
    public String getId(String token) {
        Claims claims = this.getClaims(token);
        return claims.getId();
    }

}
