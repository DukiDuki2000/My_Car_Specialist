package com.apsi_projekt.api_gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.SignatureException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilsTest {

    private JwtUtils jwtUtils;

    // Przykładowy klucz Base64 (256-bit).
    // UWAGA: W realnym projekcie możesz go wczytywać z properties lub
    // generować dynamicznie w trakcie testu.
    private static final String TEST_SECRET = "YWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYQ==";

    // Poniższe tokeny musisz dostosować do swojego secretu, roli, sub, itp.
    private static final String VALID_TOKEN = "<Wstaw tutaj ważny token JWT pasujący do TEST_SECRET>";
    private static final String INVALID_TOKEN = "niepoprawny_token_jwt";
    // dodać expired

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        jwtUtils = new JwtUtils();
        // wstrzykujemy sekretny klucz do pola 'secret'
        ReflectionTestUtils.setField(jwtUtils, "secret", TEST_SECRET);
    }

    @Test
    void getClaims_validToken_shouldReturnClaims() {
        // given
        // VALID_TOKEN musi być ważnym tokenem zgodnym z TEST_SECRET

        // when
        Claims claims = jwtUtils.getClaims(VALID_TOKEN);

        // then
        assertNotNull(claims);
        // sprawdźmy np. czy sub nie jest pusty
        assertEquals("test-user", claims.getSubject());
    }

    @Test
    void getClaims_invalidToken_shouldThrowException() {
        // given
        // INVALID_TOKEN jest niewłaściwy

        // when + then
        assertThrows(SignatureException.class, () -> jwtUtils.getClaims(INVALID_TOKEN));
    }

    @Test
    void getRoles_validToken_shouldReturnRoles() {
        // given
        // Zakładamy, że token w polu "Roles" zawiera listę map z kluczami "authority"

        // when
        List<String> roles = jwtUtils.getRoles(VALID_TOKEN);

        // then
        assertNotNull(roles);
        assertTrue(roles.contains("ROLE_USER"));
    }

    @Test
    void getUsername_validToken_shouldReturnUsername() {
        // when
        String username = jwtUtils.getUsername(VALID_TOKEN);

        // then
        assertEquals("test-user", username);
    }

    @Test
    void getId_validToken_shouldReturnId() {
        // when
        String id = jwtUtils.getId(VALID_TOKEN);

        // then
        assertNotNull(id);
        // sprawdź czy ID jest takie, jak zakładaliśmy
        assertEquals("123", id);
    }
}
