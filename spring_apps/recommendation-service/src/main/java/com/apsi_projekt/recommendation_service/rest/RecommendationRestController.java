package com.apsi_projekt.recommendation_service.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("recommendation")
public class RecommendationRestController {

    public RecommendationRestController() {
    }

    @GetMapping()
    public String sayHello() {
        return "Hello from Recommendation Service!";
    }
}
