package com.apsi_projekt.garage_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class GarageServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(GarageServiceApplication.class, args);
	}
	@GetMapping("/hello")
	public String hello(@RequestParam(value = "name", defaultValue = "garage-service") String name) {
		return String.format("Hello %s!", name, "in container now!");
	}
}
