package com.apsi_projekt.api_gateway.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.server.reactive.ServerHttpRequest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import java.net.URI;


class RouterValidatorTest {

    private RouterValidator routerValidator;

    @Mock
    private ServerHttpRequest request;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        routerValidator = new RouterValidator();
    }

    @Test
    void isSecured_whenEndpointIsOpenApi_shouldReturnFalse() {
        // given
        when(request.getURI()).thenReturn(URI.create("http://localhost:8080/user/auth/signin"));

        // when
        boolean result = routerValidator.isSecured.test(request);

        // then
        assertFalse(result, "Oczekiwano, że /user/auth/signin nie będzie chroniony");
    }

    @Test
    void isSecured_whenEndpointIsNotOnOpenList_shouldReturnTrue() {
        // given
        when(request.getURI()).thenReturn(URI.create("http://localhost:8080/user/profile"));

        // when
        boolean result = routerValidator.isSecured.test(request);

        // then
        assertTrue(result, "Oczekiwano, że /user/profile będzie chroniony");
    }
}
