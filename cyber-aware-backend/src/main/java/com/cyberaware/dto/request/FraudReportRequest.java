package com.cyberaware.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FraudReportRequest {

    @NotBlank(message = "Fraud type is required")
    private String fraudType;

    @NotBlank(message = "Description is required")
    private String description;

    private String location;
}
