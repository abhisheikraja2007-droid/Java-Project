package com.precinct12.cms.controller;

import com.precinct12.cms.domain.AuditLog;
import com.precinct12.cms.domain.AuditCategory;
import com.precinct12.cms.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/cms/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_REPORTS')")
    public ResponseEntity<Page<AuditLog>> getAll(
            @RequestParam(required = false) AuditCategory category,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 50) Pageable pageable) {
        return ResponseEntity.ok(auditService.findWithFilters(category, search, pageable));
    }

    @GetMapping("/recent")
    @PreAuthorize("hasAuthority('VIEW_REPORTS')")
    public ResponseEntity<List<AuditLog>> getRecent(@RequestParam(defaultValue = "100") int limit) {
        return ResponseEntity.ok(auditService.findTop100());
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAuthority('VIEW_REPORTS')")
    public ResponseEntity<Page<AuditLog>> getByDateRange(
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end,
            @PageableDefault(size = 50) Pageable pageable) {
        return ResponseEntity.ok(auditService.findByTimestampBetween(start, end, pageable));
    }
}