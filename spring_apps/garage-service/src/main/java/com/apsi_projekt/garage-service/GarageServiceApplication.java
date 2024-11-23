package com.apsi_projekt.garage_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@RestController
public class GarageServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(GarageServiceApplication.class, args);
	}
	@GetMapping("/hello")
	public String hello(@RequestParam(value = "name", defaultValue = "garage-service") String name) {
		return String.format("Hello %s!", name);
	}
}
