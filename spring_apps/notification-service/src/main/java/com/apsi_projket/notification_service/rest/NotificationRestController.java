package com.apsi_projket.notification_service.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("notification")
public class NotificationRestController {

    public NotificationRestController() {
    }

    @GetMapping()
    public String sayHello() {
        return "Hello from Notification Service!";
    }
}
