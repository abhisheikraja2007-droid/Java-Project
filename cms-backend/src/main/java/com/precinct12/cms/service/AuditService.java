package com.precinct12.cms.service;

import com.precinct12.cms.domain.AuditLog;
import com.precinct12.cms.domain.AuditCategory;
import com.precinct12.cms.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Transactional
    public AuditLog log(String event, AuditCategory category, String details, String payload) {
        AuditLog log = AuditLog.builder()
                .event(event)
                .category(category)
                .user(getCurrentUser())
                .ipAddress(getCurrentIp())
                .details(details)
                .payload(payload)
                .timestamp(LocalDateTime.now())
                .build();
        return auditLogRepository.save(log);
    }

    public Page<AuditLog> findWithFilters(AuditCategory category, String search, Pageable pageable) {
        return auditLogRepository.findWithFilters(category, search, pageable);
    }

    public List<AuditLog> findTop100() {
        return auditLogRepository.findTop100ByOrderByTimestampDesc();
    }

    public Page<AuditLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end, Pageable pageable) {
        return auditLogRepository.findByTimestampBetween(start, end, pageable);
    }

    private String getCurrentUser() {
        // In real impl, extract from SecurityContext
        return "Inspector Elena Rostova (Badge 1204)";
    }

    private String getCurrentIp() {
        // In real impl, extract from RequestContextHolder
        return "10.122.45.104";
    }
}