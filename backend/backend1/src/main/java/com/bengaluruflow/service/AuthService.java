package com.bengaluruflow.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.bengaluruflow.dto.AuthRequest;
import com.bengaluruflow.dto.AuthResponse;
import com.bengaluruflow.entity.AppUser;
import com.bengaluruflow.repository.AppUserRepository;

@Service
public class AuthService {
    private final AppUserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwt;
    public AuthService(AppUserRepository users, PasswordEncoder passwordEncoder, JwtService jwt) { this.users = users; this.passwordEncoder = passwordEncoder; this.jwt = jwt; }
    @Transactional public AuthResponse register(AuthRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email)) throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        AppUser user = users.save(new AppUser(email, passwordEncoder.encode(request.password()), "ROLE_USER"));
        return response(user);
    }
    @Transactional(readOnly = true) public AuthResponse login(AuthRequest request) {
        AppUser user = users.findByEmailIgnoreCase(request.email().trim()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        return response(user);
    }
    private AuthResponse response(AppUser user) { return new AuthResponse(jwt.create(user), "Bearer", user.getEmail(), user.getRole()); }
}