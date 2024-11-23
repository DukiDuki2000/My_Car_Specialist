package com.apsi_projekt.api_gateway.rest.recommendation;

import com.apsi_projekt.api_gateway.infrastructure.recommendation.client.RestRecommendationServiceClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("recommendation")
public class RecommendationRestController {
    private final RestRecommendationServiceClient restRecommendationServiceClient;

    public RecommendationRestController(RestRecommendationServiceClient restRecommendationServiceClient) {
        this.restRecommendationServiceClient = restRecommendationServiceClient;

    }

    @GetMapping()
    public String getHello() {
        return restRecommendationServiceClient.getHello();
    }
}
