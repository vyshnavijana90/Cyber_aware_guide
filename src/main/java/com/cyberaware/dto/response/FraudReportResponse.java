package com.cyberaware.dto.response;

import com.cyberaware.entity.FraudReport.ReportStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FraudReportResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String fraudType;
    private String description;
    private String location;
    private String screenshotUrl;
    private ReportStatus status;
    private LocalDateTime createdAt;
}
