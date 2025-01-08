package com.apsi_projekt.notification_service.rest;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("notification")
public class NotificationRestController {

    public NotificationRestController() {
    }

    @GetMapping()
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public String sayHello() {
        return "Hello from Notification Service!!";
    }
}
