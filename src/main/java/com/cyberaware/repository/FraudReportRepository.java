package com.cyberaware.repository;

import com.cyberaware.entity.FraudReport;
import com.cyberaware.entity.FraudReport.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface FraudReportRepository extends JpaRepository<FraudReport, Long> {

    List<FraudReport> findByUserId(Long userId);

    List<FraudReport> findByStatus(ReportStatus status);

    List<FraudReport> findByFraudType(String fraudType);

    List<FraudReport> findByFraudTypeAndStatus(String fraudType, ReportStatus status);

    @Query("SELECT f.fraudType, COUNT(f) FROM FraudReport f GROUP BY f.fraudType")
    List<Object[]> countByFraudType();

    @Query("SELECT f.status, COUNT(f) FROM FraudReport f GROUP BY f.status")
    List<Object[]> countByStatus();

    long countByStatus(ReportStatus status);
}
