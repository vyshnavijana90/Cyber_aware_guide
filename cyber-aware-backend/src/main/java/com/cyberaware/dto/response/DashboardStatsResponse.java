package com.cyberaware.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalUsers;
    private long totalReports;
    private long pendingReports;
    private long resolvedReports;
    private Map<String, Long> reportsByCategory;
    private Map<String, Long> reportsByStatus;
}
