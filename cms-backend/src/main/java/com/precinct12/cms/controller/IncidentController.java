package com.precinct12.cms.controller;

import com.precinct12.cms.domain.Incident;
import com.precinct12.cms.domain.IncidentStatus;
import com.precinct12.cms.service.IncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/cms/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_ALL')")
    public ResponseEntity<Page<Incident>> getAll(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(incidentService.search(search, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('VIEW_ALL')")
    public ResponseEntity<Incident> getById(@PathVariable String id) {
        return incidentService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAuthority('VIEW_ALL')")
    public ResponseEntity<List<Incident>> getByStatus(@PathVariable IncidentStatus status) {
        return ResponseEntity.ok(incidentService.findByStatus(status));
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAuthority('VIEW_ALL')")
    public ResponseEntity<List<Incident>> getByDateRange(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end) {
        return ResponseEntity.ok(incidentService.findByDateRange(start, end));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_INCIDENT')")
    public ResponseEntity<Incident> create(@RequestBody Incident incident) {
        return ResponseEntity.ok(incidentService.create(incident));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('EDIT_INCIDENT')")
    public ResponseEntity<Incident> update(@PathVariable String id, @RequestBody Incident updates) {
        return ResponseEntity.ok(incidentService.update(id, updates));
    }

    @PostMapping("/{id}/promote")
    @PreAuthorize("hasAuthority('CREATE_INCIDENT')")
    public ResponseEntity<Incident> promoteToCase(@PathVariable String id) {
        return ResponseEntity.ok(incidentService.promoteToCase(id));
    }
}