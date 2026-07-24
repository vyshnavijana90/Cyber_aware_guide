package com.cyberaware.controller;

import com.cyberaware.dto.request.AdminLoginRequest;
import com.cyberaware.dto.request.UpdateReportStatusRequest;
import com.cyberaware.dto.response.ApiResponse;
import com.cyberaware.dto.response.AuthResponse;
import com.cyberaware.dto.response.DashboardStatsResponse;
import com.cyberaware.dto.response.FraudReportResponse;
import com.cyberaware.dto.response.UserResponse;
import com.cyberaware.service.AdminService;
import com.cyberaware.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final AuthService authService;

    // POST /api/admin/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> adminLogin(@Valid @RequestBody AdminLoginRequest request) {
        return ResponseEntity.ok(authService.adminLogin(request));
    }

    // GET /api/admin/users
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // GET /api/admin/reports
    @GetMapping("/reports")
    public ResponseEntity<List<FraudReportResponse>> getAllReports(
            @RequestParam(value = "type", required = false) String fraudType,
            @RequestParam(value = "status", required = false) String status) {
        return ResponseEntity.ok(adminService.getAllReports(fraudType, status));
    }

    // PUT /api/admin/reports/{id}
    @PutMapping("/reports/{id}")
    public ResponseEntity<ApiResponse> updateReportStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReportStatusRequest request) {
        FraudReportResponse updated = adminService.updateReportStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.ok("Report status updated", updated));
    }

    // GET /api/admin/stats
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }
}
