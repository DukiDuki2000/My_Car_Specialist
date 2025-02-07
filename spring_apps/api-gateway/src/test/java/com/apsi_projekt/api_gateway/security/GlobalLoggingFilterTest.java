package com.apsi_projekt.api_gateway.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import static org.junit.jupiter.api.Assertions.*;
import java.net.URI;

import static org.mockito.Mockito.*;

class GlobalLoggingFilterTest {

    @Mock
    private GatewayFilterChain chain;

    @Mock
    private ServerWebExchange exchange;

    @Mock
    private ServerHttpRequest request;

    @InjectMocks
    private GlobalLoggingFilter globalLoggingFilter;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void filter_shouldCallChainFilter() {
        // given
        when(exchange.getRequest()).thenReturn(request);
        when(request.getURI()).thenReturn(URI.create("http://localhost:8080/test"));
        when(chain.filter(exchange)).thenReturn(Mono.empty());

        // when
        Mono<Void> result = globalLoggingFilter.filter(exchange, chain);

        // then
        verify(chain, times(1)).filter(exchange);
        assertNotNull(result);
    }
}
