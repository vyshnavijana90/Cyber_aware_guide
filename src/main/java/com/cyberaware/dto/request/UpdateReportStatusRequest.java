package com.cyberaware.dto.request;

import com.cyberaware.entity.FraudReport.ReportStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateReportStatusRequest {

    @NotNull(message = "Status is required")
    private ReportStatus status;
}
