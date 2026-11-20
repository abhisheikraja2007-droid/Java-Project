package com.precinct12.cms.controller;

import com.precinct12.cms.domain.Evidence;
import com.precinct12.cms.domain.EvidenceStatus;
import com.precinct12.cms.service.EvidenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/cms/evidence")
@RequiredArgsConstructor
public class EvidenceController {

    private final EvidenceService evidenceService;

    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_ALL')")
    public ResponseEntity<Page<Evidence>> getAll(
            @RequestParam(required = false) EvidenceStatus status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(evidenceService.findWithFilters(status, category, search, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('VIEW_ALL')")
    public ResponseEntity<Evidence> getById(@PathVariable String id) {
        return evidenceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/case/{caseId}")
    @PreAuthorize("hasAuthority('VIEW_ALL')")
    public ResponseEntity<List<Evidence>> getByCaseId(@PathVariable String caseId) {
        return ResponseEntity.ok(evidenceService.findByCaseId(caseId));
    }

    @GetMapping("/expiring")
    @PreAuthorize("hasAuthority('VIEW_ALL')")
    public ResponseEntity<List<Evidence>> getExpiringSoon(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(evidenceService.findExpiringSoon(LocalDateTime.now().plusDays(days)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('EDIT_EVIDENCE')")
    public ResponseEntity<Evidence> create(@RequestBody Evidence evidence) {
        return ResponseEntity.ok(evidenceService.create(evidence));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('EDIT_EVIDENCE')")
    public ResponseEntity<Evidence> update(@PathVariable String id, @RequestBody Evidence updates) {
        return ResponseEntity.ok(evidenceService.update(id, updates));
    }

    @PostMapping("/{id}/checkout")
    @PreAuthorize("hasAuthority('AUTHORIZE_EVIDENCE')")
    public ResponseEntity<Evidence> checkout(@PathVariable String id, @RequestBody CheckoutRequest request) {
        return ResponseEntity.ok(evidenceService.checkout(
                id, request.officerName, request.badgeNumber, 
                request.reason, request.expectedReturnDate, request.hmacSignature));
    }

    @PostMapping("/{id}/checkin")
    @PreAuthorize("hasAuthority('AUTHORIZE_EVIDENCE')")
    public ResponseEntity<Evidence> checkin(@PathVariable String id, @RequestBody CheckinRequest request) {
        return ResponseEntity.ok(evidenceService.checkin(id, request.custodianName, request.badgeNumber));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('AUTHORIZE_DISPOSAL')")
    public ResponseEntity<Evidence> updateStatus(@PathVariable String id, @RequestBody StatusRequest request) {
        return ResponseEntity.ok(evidenceService.updateStatus(id, request.status));
    }

    @GetMapping("/{id}/verify-chain")
    @PreAuthorize("hasAuthority('VIEW_ALL')")
    public ResponseEntity<Map<String, Boolean>> verifyChain(@PathVariable String id) {
        return ResponseEntity.ok(Map.of("valid", evidenceService.verifyChainOfCustody(id)));
    }

    record CheckoutRequest(String officerName, String badgeNumber, String reason, 
                          LocalDateTime expectedReturnDate, String hmacSignature) {}
    record CheckinRequest(String custodianName, String badgeNumber) {}
    record StatusRequest(EvidenceStatus status) {}
}