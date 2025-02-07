package com.apsi_projekt.api_gateway.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleExpiredJwtException_shouldReturnUnauthorized() {
        // given
        ExpiredJwtException exception = new ExpiredJwtException(null, null, "Token jest przeterminowany");

        // when
        ResponseEntity<Map<String, String>> response = handler.handleExpiredJwtException(exception);

        // then
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Token is expired", response.getBody().get("error"));
    }

    @Test
    void handleMalformedJwtException_shouldReturnBadRequest() {
        // given
        MalformedJwtException exception = new MalformedJwtException("Token niepoprawny");

        // when
        ResponseEntity<Map<String, String>> response = handler.handleMalformedJwtException(exception);

        // then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Token is invalid", response.getBody().get("error"));
    }

    @Test
    void handleSignatureException_shouldReturnUnauthorized() {
        // given
        SignatureException exception = new SignatureException("Błędny podpis tokena");

        // when
        ResponseEntity<Map<String, String>> response = handler.handleSignatureException(exception);

        // then
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Token signature is invalid", response.getBody().get("error"));
    }

    @Test
    void handleJwtException_shouldReturnBadRequest() {
        // given
        JwtException exception = new JwtException("Błąd JWT");

        // when
        ResponseEntity<Map<String, String>> response = handler.handleJwtException(exception);

        // then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Token error", response.getBody().get("error"));
    }
}
