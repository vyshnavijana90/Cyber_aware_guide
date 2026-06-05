package com.cyberaware.service;

import com.cyberaware.dto.response.DashboardStatsResponse;
import com.cyberaware.dto.response.FraudReportResponse;
import com.cyberaware.dto.response.UserResponse;
import com.cyberaware.entity.FraudReport;
import com.cyberaware.entity.FraudReport.ReportStatus;
import com.cyberaware.exception.ResourceNotFoundException;
import com.cyberaware.repository.FraudReportRepository;
import com.cyberaware.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final FraudReportRepository reportRepository;
    private final ReportService reportService;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .phoneNumber(user.getPhoneNumber())
                        .createdAt(user.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public List<FraudReportResponse> getAllReports(String fraudType, String status) {
        List<FraudReport> reports;

        if (fraudType != null && status != null) {
            ReportStatus reportStatus = ReportStatus.valueOf(status.toUpperCase());
            reports = reportRepository.findByFraudTypeAndStatus(fraudType, reportStatus);
        } else if (fraudType != null) {
            reports = reportRepository.findByFraudType(fraudType);
        } else if (status != null) {
            ReportStatus reportStatus = ReportStatus.valueOf(status.toUpperCase());
            reports = reportRepository.findByStatus(reportStatus);
        } else {
            reports = reportRepository.findAll();
        }

        return reports.stream().map(reportService::mapToResponse).collect(Collectors.toList());
    }

    public FraudReportResponse updateReportStatus(Long reportId, ReportStatus newStatus) {
        FraudReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));
        report.setStatus(newStatus);
        FraudReport updated = reportRepository.save(report);
        return reportService.mapToResponse(updated);
    }

    public DashboardStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalReports = reportRepository.count();
        long pendingReports = reportRepository.countByStatus(ReportStatus.PENDING);
        long resolvedReports = reportRepository.countByStatus(ReportStatus.RESOLVED);

        // Reports by category
        Map<String, Long> reportsByCategory = new HashMap<>();
        reportRepository.countByFraudType().forEach(row ->
                reportsByCategory.put((String) row[0], (Long) row[1]));

        // Reports by status
        Map<String, Long> reportsByStatus = new HashMap<>();
        reportRepository.countByStatus().forEach(row ->
                reportsByStatus.put(((ReportStatus) row[0]).name(), (Long) row[1]));

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalReports(totalReports)
                .pendingReports(pendingReports)
                .resolvedReports(resolvedReports)
                .reportsByCategory(reportsByCategory)
                .reportsByStatus(reportsByStatus)
                .build();
    }
}
