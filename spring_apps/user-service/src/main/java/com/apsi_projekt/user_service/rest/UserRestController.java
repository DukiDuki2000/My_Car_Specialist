package com.apsi_projekt.user_service.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("user")
public class UserRestController {

    public UserRestController() {
    }

    @GetMapping()
    public String sayHello() {
        return "Hello from User Service";
    }
}
