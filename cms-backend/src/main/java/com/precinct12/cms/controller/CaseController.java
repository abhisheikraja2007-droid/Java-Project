package com.precinct12.cms.controller;

import com.precinct12.cms.domain.Case;
import com.precinct12.cms.domain.Incident;
import com.precinct12.cms.domain.TimelineEvent;
import com.precinct12.cms.service.CaseService;
import com.precinct12.cms.service.IncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/cms/cases")
@RequiredArgsConstructor
public class CaseController {

    private final CaseService caseService;
    private final IncidentService incidentService;

    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_ALL')")
    public ResponseEntity<Page<Case>> getAll(
            @RequestParam(required = false) Case.CaseStatus status,
            @RequestParam(required = false) Case.Priority priority,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(caseService.findWithFilters(status, priority, search, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('VIEW_ALL')")
    public ResponseEntity<Case> getById(@PathVariable String id) {
        return caseService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('EDIT_CASE')")
    public ResponseEntity<Case> create(@RequestBody Case caseEntity) {
        return ResponseEntity.ok(caseService.create(caseEntity));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('EDIT_CASE')")
    public ResponseEntity<Case> update(@PathVariable String id, @RequestBody Case updates) {
        return ResponseEntity.ok(caseService.update(id, updates));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('EDIT_CASE')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        caseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/timeline")
    @PreAuthorize("hasAuthority('EDIT_CASE')")
    public ResponseEntity<Case> addTimelineEvent(@PathVariable String id, @RequestBody TimelineEvent event) {
        return ResponseEntity.ok(caseService.addTimelineEvent(id, event));
    }

    @PostMapping("/from-incident/{incidentId}")
    @PreAuthorize("hasAuthority('CREATE_INCIDENT')")
    public ResponseEntity<Case> promoteFromIncident(@PathVariable String incidentId) {
        Incident incident = incidentService.findById(incidentId)
                .orElseThrow(() -> new IllegalArgumentException("Incident not found: " + incidentId));
        return ResponseEntity.ok(caseService.promoteFromIncident(incident));
    }
}