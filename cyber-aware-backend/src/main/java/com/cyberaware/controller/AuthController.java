package com.cyberaware.controller;

import com.cyberaware.dto.request.AdminLoginRequest;
import com.cyberaware.dto.request.LoginRequest;
import com.cyberaware.dto.request.RegisterRequest;
import com.cyberaware.dto.request.VerifyEmailRequest;
import com.cyberaware.dto.response.ApiResponse;
import com.cyberaware.dto.response.AuthResponse;
import com.cyberaware.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;



    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // POST /api/admin/login  (also accessible here for convenience)
    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponse> adminLogin(@Valid @RequestBody AdminLoginRequest request) {
        return ResponseEntity.ok(authService.adminLogin(request));
    }
}
