package com.apsi_projekt.api_gateway.security;
import lombok.Data;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.GatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;


@Component
public class RoleFilter implements GatewayFilterFactory<RoleFilter.Config> {

    private final JwtUtils jwtUtils;
    private final RouterValidator routerValidator;

    public RoleFilter(JwtUtils jwtUtils, RouterValidator routerValidator) {
        System.out.println("testFilter bean created!");
        this.jwtUtils = jwtUtils;
        this.routerValidator = routerValidator;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            HttpHeaders headers = exchange.getRequest().getHeaders();
            String authHeader = headers.getFirst(HttpHeaders.AUTHORIZATION);

            if (routerValidator.isSecured.test(exchange.getRequest())){
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }

                String token = authHeader.substring(7);

                String id = jwtUtils.getId(token);
                String username = jwtUtils.getUsername(token);
                List<String> roles = jwtUtils.getRoles(token);
                exchange = exchange.mutate()
                        .request(exchange.getRequest().mutate()
                                .header("X-Roles", String.join(",", roles))
                                .header("X-Id",id)
                                .header("X-Username", username)
                                .build())
                        .build();
            }
            return chain.filter(exchange);
        };
    }
    @Data
    public static class Config {
        private String role;
    }

    private Mono<Void> onError(ServerWebExchange exchange, HttpStatus httpStatus)  {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);

        return response.setComplete();
    }

    @Override
    public Class<Config> getConfigClass() {
        return Config.class;
    }
}
