package com.apsi_projekt.user_service.rest;

import com.apsi_projekt.user_service.models.User;
import com.apsi_projekt.user_service.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequestMapping("user")
public class UserRestController {

    UserRepository userRepository;

    @Autowired
    public UserRestController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @GetMapping("/openApi")
    @PreAuthorize("hasRole('ROLE_SERVICE')")
    public String sayHello() {
        return "Hello from User Service";
    }

    @GetMapping("/getId/{username}")
    @PreAuthorize("hasRole('ROLE_SERVICE')")
    public Long getIdByUsername(@PathVariable String username) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            return optionalUser.get().getId();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

    }
}
