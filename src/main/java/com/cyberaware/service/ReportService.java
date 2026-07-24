package com.cyberaware.service;

import com.cyberaware.dto.request.FraudReportRequest;
import com.cyberaware.dto.response.FraudReportResponse;
import com.cyberaware.entity.FraudReport;
import com.cyberaware.entity.User;
import com.cyberaware.exception.ResourceNotFoundException;
import com.cyberaware.repository.FraudReportRepository;
import com.cyberaware.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final FraudReportRepository reportRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public FraudReportResponse submitReport(FraudReportRequest request,
                                            MultipartFile screenshot,
                                            String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String screenshotUrl = null;
        if (screenshot != null && !screenshot.isEmpty()) {
            screenshotUrl = fileStorageService.storeFile(screenshot);
        }

        FraudReport report = FraudReport.builder()
                .user(user)
                .fraudType(request.getFraudType())
                .description(request.getDescription())
                .location(request.getLocation())
                .screenshotUrl(screenshotUrl)
                .status(FraudReport.ReportStatus.PENDING)
                .build();

        FraudReport saved = reportRepository.save(report);
        return mapToResponse(saved);
    }

    public List<FraudReportResponse> getMyReports(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return reportRepository.findByUserId(user.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public FraudReportResponse mapToResponse(FraudReport report) {
        return FraudReportResponse.builder()
                .id(report.getId())
                .userId(report.getUser().getId())
                .userName(report.getUser().getName())
                .userEmail(report.getUser().getEmail())
                .fraudType(report.getFraudType())
                .description(report.getDescription())
                .location(report.getLocation())
                .screenshotUrl(report.getScreenshotUrl())
                .status(report.getStatus())
                .createdAt(report.getCreatedAt())
                .build();
    }
}
