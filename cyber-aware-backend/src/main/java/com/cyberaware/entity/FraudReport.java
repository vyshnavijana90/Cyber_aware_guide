package com.cyberaware.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "fraud_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraudReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "fraud_type", nullable = false)
    private String fraudType;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    @Column(name = "screenshot_url")
    private String screenshotUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ReportStatus status = ReportStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum ReportStatus {
        PENDING, UNDER_REVIEW, RESOLVED, REJECTED
    }
}
