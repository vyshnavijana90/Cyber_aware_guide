package com.cyberaware.controller;

import com.cyberaware.dto.request.FraudReportRequest;
import com.cyberaware.dto.response.ApiResponse;
import com.cyberaware.dto.response.FraudReportResponse;
import com.cyberaware.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    // POST /api/reports
    @PostMapping
    public ResponseEntity<ApiResponse> submitReport(
            @Valid @ModelAttribute FraudReportRequest request,
            @RequestParam(value = "screenshot", required = false) MultipartFile screenshot,
            @AuthenticationPrincipal UserDetails userDetails) {
        FraudReportResponse report = reportService.submitReport(request, screenshot, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Report submitted successfully", report));
    }

    // GET /api/reports
    @GetMapping
    public ResponseEntity<List<FraudReportResponse>> getMyReports(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reportService.getMyReports(userDetails.getUsername()));
    }
}
