package com.apsi_projekt.vehicle_service.config;


import jakarta.annotation.PostConstruct;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "vin.decoder")
public class VinDecoderProperties {
    private String apiKey;
    private String secretKey;

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public String getApiKey() {
        return apiKey;
    }

    public String getSecretKey() {
        return secretKey;
    }
    @PostConstruct
    public void debugLog() {
        System.out.println("[DEBUG] vin.decoder.apiKey=" + apiKey);
        System.out.println("[DEBUG] vin.decoder.secretKey=" + secretKey);
    }
}
