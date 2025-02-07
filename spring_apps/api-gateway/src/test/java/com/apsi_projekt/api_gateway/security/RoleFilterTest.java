package com.apsi_projekt.api_gateway.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.*;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RoleFilterTest {

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private RouterValidator routerValidator;

    @Mock
    private ServerWebExchange exchange;

    @Mock
    private ServerHttpRequest request;

    @Mock
    private HttpHeaders headers;

    @Mock
    private GatewayFilterChain chain;

    @Mock
    private ServerHttpResponse response;

    @InjectMocks
    private RoleFilter roleFilter;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        when(exchange.getRequest()).thenReturn(request);
        when(request.getHeaders()).thenReturn(headers);
        when(exchange.getResponse()).thenReturn(response);
    }

    @Test
    void apply_whenNotSecured_shouldSkipAuthCheck() {
        // given
        when(routerValidator.isSecured).thenReturn(req -> false);
        when(chain.filter(exchange)).thenReturn(Mono.empty());

        // when
        RoleFilter.Config config = new RoleFilter.Config();
        Mono<Void> result = roleFilter.apply(config).filter(exchange, chain);

        // then
        verify(headers, never()).getFirst(HttpHeaders.AUTHORIZATION);
        verify(chain, times(1)).filter(exchange);
        assertNotNull(result);
    }

    @Test
    void apply_whenSecuredAndNoAuthorizationHeader_shouldSetStatusUnauthorized() {
        // given
        when(routerValidator.isSecured).thenReturn(req -> true);
        when(headers.getFirst(HttpHeaders.AUTHORIZATION)).thenReturn(null);

        // when
        RoleFilter.Config config = new RoleFilter.Config();
        roleFilter.apply(config).filter(exchange, chain).block();

        // then
        verify(response, times(1)).setStatusCode(HttpStatus.UNAUTHORIZED);
        verify(chain, never()).filter(exchange);
    }

    @Test
    void apply_whenSecuredAndInvalidAuthorizationHeader_shouldSetStatusUnauthorized() {
        // given
        when(routerValidator.isSecured).thenReturn(req -> true);
        when(headers.getFirst(HttpHeaders.AUTHORIZATION)).thenReturn("InvalidHeader");

        // when
        RoleFilter.Config config = new RoleFilter.Config();
        roleFilter.apply(config).filter(exchange, chain).block();

        // then
        verify(response, times(1)).setStatusCode(HttpStatus.UNAUTHORIZED);
        verify(chain, never()).filter(exchange);
    }

    @Test
    void apply_whenSecuredAndValidAuthorizationHeader_shouldAddHeadersAndContinue() {
        // given
        when(routerValidator.isSecured).thenReturn(req -> true);
        when(headers.getFirst(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer valid_token");
        when(jwtUtils.getId("valid_token")).thenReturn("123");
        when(jwtUtils.getUsername("valid_token")).thenReturn("testUser");
        when(jwtUtils.getRoles("valid_token")).thenReturn(List.of("ROLE_USER"));
        when(chain.filter(any(ServerWebExchange.class))).thenReturn(Mono.empty());

        // when
        RoleFilter.Config config = new RoleFilter.Config();
        Mono<Void> result = roleFilter.apply(config).filter(exchange, chain);

        // then
        // Sprawdzamy, czy zostało wywołane chain.filter z nowo zbudowanym exchange
        verify(chain, times(1)).filter(any(ServerWebExchange.class));
        assertNotNull(result);
    }
}
