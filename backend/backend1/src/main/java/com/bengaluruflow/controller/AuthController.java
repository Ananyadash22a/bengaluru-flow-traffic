package com.bengaluruflow.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bengaluruflow.dto.AuthRequest;
import com.bengaluruflow.dto.AuthResponse;
import com.bengaluruflow.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.ResponseStatus;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth;
    public AuthController(AuthService auth) { this.auth = auth; }
    @PostMapping("/register") @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody AuthRequest request) { return auth.register(request); }
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) { return auth.login(request); }
}