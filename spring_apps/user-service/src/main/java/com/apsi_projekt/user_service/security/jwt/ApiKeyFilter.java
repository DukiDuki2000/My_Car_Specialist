package com.apsi_projekt.user_service.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;


public class ApiKeyFilter extends OncePerRequestFilter {

    private static final String API_KEY_HEADER = "X-API-KEY";

    @Value("${API.SECRET.KEY}")
    private String EXPECTED_API_KEY;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("Api Key filtering...");
        String apiKey = request.getHeader(API_KEY_HEADER);
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        // Jeżeli klucz API jest poprawny i brak nagłówka Authorization
        if (apiKey != null && apiKey.equals(EXPECTED_API_KEY) && authHeader == null) {
            List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_SERVICE"));
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(null, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println("API Key authentication successful, skipping JWT filter");
            filterChain.doFilter(request, response);
            return; // Zakończ, jeśli mamy poprawny API Key
        }

        // Jeśli nie ma klucza API, przepuść dalej do filtra JWT
        filterChain.doFilter(request, response);
    }
}
