package com.precinct12.cms.controller;

import com.precinct12.cms.domain.Suspect;
import com.precinct12.cms.domain.Suspect.CriminalRecordItem;
import com.precinct12.cms.service.SuspectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cms/suspects")
@RequiredArgsConstructor
public class SuspectController {

    private final SuspectService suspectService;

    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_ALL')")
    public ResponseEntity<Page<Suspect>> getAll(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(suspectService.search(search, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('VIEW_ALL')")
    public ResponseEntity<Suspect> getById(@PathVariable String id) {
        return suspectService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAuthority('VIEW_ALL')")
    public ResponseEntity<List<Suspect>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(suspectService.findByStatus(status));
    }

    @GetMapping("/risk/{riskLevel}")
    @PreAuthorize("hasAuthority('VIEW_ALL')")
    public ResponseEntity<List<Suspect>> getByRiskLevel(@PathVariable String riskLevel) {
        return ResponseEntity.ok(suspectService.findByRiskLevel(riskLevel));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('EDIT_CASE')")
    public ResponseEntity<Suspect> create(@RequestBody Suspect suspect) {
        return ResponseEntity.ok(suspectService.create(suspect));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('EDIT_CASE')")
    public ResponseEntity<Suspect> update(@PathVariable String id, @RequestBody Suspect updates) {
        return ResponseEntity.ok(suspectService.update(id, updates));
    }

    @PostMapping("/{id}/aliases")
    @PreAuthorize("hasAuthority('EDIT_CASE')")
    public ResponseEntity<Suspect> addAlias(@PathVariable String id, @RequestBody AliasRequest request) {
        return ResponseEntity.ok(suspectService.addAlias(id, request.alias()));
    }

    @PostMapping("/{id}/criminal-record")
    @PreAuthorize("hasAuthority('EDIT_CASE')")
    public ResponseEntity<Suspect> addCriminalRecord(@PathVariable String id, @RequestBody CriminalRecordItem record) {
        return ResponseEntity.ok(suspectService.addCriminalRecord(id, record));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('EDIT_CASE')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        suspectService.delete(id);
        return ResponseEntity.noContent().build();
    }

    record AliasRequest(String alias) {}
}