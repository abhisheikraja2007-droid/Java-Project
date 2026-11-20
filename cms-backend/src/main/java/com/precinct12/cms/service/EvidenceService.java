package com.precinct12.cms.service;

import com.precinct12.cms.domain.Evidence;
import com.precinct12.cms.domain.EvidenceStatus;
import com.precinct12.cms.domain.CustodyEvent;
import com.precinct12.cms.repository.EvidenceRepository;
import com.precinct12.cms.repository.CustodyEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EvidenceService {

    private final EvidenceRepository evidenceRepository;
    private final CustodyEventRepository custodyEventRepository;
    private final AuditService auditService;

    public Page<Evidence> findAll(Pageable pageable) {
        return evidenceRepository.findAll(pageable);
    }

    public Page<Evidence> findWithFilters(EvidenceStatus status, String category, String search, Pageable pageable) {
        return evidenceRepository.findWithFilters(status, category, search, pageable);
    }

    public Optional<Evidence> findById(String id) {
        return evidenceRepository.findById(id);
    }

    public Optional<Evidence> findByTrackingNumber(String trackingNumber) {
        return evidenceRepository.findByTrackingNumber(trackingNumber);
    }

    public List<Evidence> findByCaseId(String caseId) {
        return evidenceRepository.findByCaseId(caseId);
    }

    public List<Evidence> findExpiringSoon(LocalDateTime before) {
        return evidenceRepository.findByRetentionDateBefore(before);
    }

    @Transactional
    public Evidence create(Evidence evidence) {
        Evidence saved = evidenceRepository.save(evidence);
        auditService.log("Evidence Created", com.precinct12.cms.domain.AuditCategory.EVIDENCE_FLOW,
                "Created evidence item: " + saved.getTrackingNumber() + " - " + saved.getTitle(),
                "{\"evidence_id\":\"" + saved.getId() + "\"}");
        return saved;
    }

    @Transactional
    public Evidence update(String id, Evidence updates) {
        Evidence existing = evidenceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Evidence not found: " + id));
        
        existing.setTitle(updates.getTitle());
        existing.setCategory(updates.getCategory());
        existing.setLocation(updates.getLocation());
        existing.setCapacityCode(updates.getCapacityCode());
        existing.setRetentionDate(updates.getRetentionDate());
        existing.setNotes(updates.getNotes());
        existing.setCaseId(updates.getCaseId());
        
        Evidence saved = evidenceRepository.save(existing);
        auditService.log("Evidence Updated", com.precinct12.cms.domain.AuditCategory.DATA_CHANGE,
                "Updated evidence item: " + saved.getTrackingNumber(),
                "{\"evidence_id\":\"" + saved.getId() + "\"}");
        return saved;
    }

    @Transactional
    public Evidence checkout(String id, String officerName, String badgeNumber, 
                            String reason, LocalDateTime expectedReturnDate, String hmacSignature) {
        Evidence evidence = evidenceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Evidence not found: " + id));
        
        if (evidence.getStatus() != EvidenceStatus.IN_STORAGE) {
            throw new IllegalStateException("Can only check out evidence that is IN_STORAGE");
        }

        evidence.setStatus(EvidenceStatus.IN_TRANSIT);
        evidence.setCheckedOutBy(officerName + " (Badge " + badgeNumber + ")");
        evidence.setCheckOutDate(LocalDateTime.now());
        evidence.setExpectedReturnDate(expectedReturnDate);

        CustodyEvent custodyEvent = CustodyEvent.builder()
                .date(LocalDateTime.now())
                .action("Checked out: " + reason)
                .officer(officerName + " (Badge " + badgeNumber + ")")
                .institution("Precinct 12 Transit Section")
                .signature(hmacSignature)
                .evidence(evidence)
                .hash(calculateChainHash(evidence, "checkout", officerName, reason))
                .build();
        
        custodyEventRepository.save(custodyEvent);
        evidence.getChainOfCustody().add(custodyEvent);
        
        Evidence saved = evidenceRepository.save(evidence);
        
        auditService.log("Evidence Checked Out", com.precinct12.cms.domain.AuditCategory.EVIDENCE_FLOW,
                "Evidence tracking #" + evidence.getTrackingNumber() + " checked out by " + officerName + ". Reason: " + reason,
                "{\"item_id\":\"" + id + "\",\"officer\":\"" + officerName + "\",\"signature\":\"" + hmacSignature + "\",\"chain_hash\":\"" + custodyEvent.getHash() + "\"}");
        
        return saved;
    }

    @Transactional
    public Evidence checkin(String id, String custodianName, String badgeNumber) {
        Evidence evidence = evidenceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Evidence not found: " + id));
        
        evidence.setStatus(EvidenceStatus.IN_STORAGE);
        evidence.setCheckedOutBy(null);
        evidence.setCheckOutDate(null);
        evidence.setExpectedReturnDate(null);

        CustodyEvent custodyEvent = CustodyEvent.builder()
                .date(LocalDateTime.now())
                .action("Returned to Secure Storage")
                .officer(custodianName + " (Badge " + badgeNumber + ")")
                .institution("Precinct 12 Evidence Locker Room 12-A")
                .signature("Custodian Verification Secure Match")
                .evidence(evidence)
                .hash(calculateChainHash(evidence, "checkin", custodianName, "return"))
                .build();
        
        custodyEventRepository.save(custodyEvent);
        evidence.getChainOfCustody().add(custodyEvent);
        
        Evidence saved = evidenceRepository.save(evidence);
        
        auditService.log("Evidence Checked In", com.precinct12.cms.domain.AuditCategory.EVIDENCE_FLOW,
                "Evidence tracking #" + evidence.getTrackingNumber() + " secure check-in completed by " + custodianName,
                "{\"item_id\":\"" + id + "\",\"chain_hash\":\"" + custodyEvent.getHash() + "\"}");
        
        return saved;
    }

    @Transactional
    public Evidence updateStatus(String id, EvidenceStatus status) {
        Evidence evidence = evidenceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Evidence not found: " + id));
        
        EvidenceStatus oldStatus = evidence.getStatus();
        evidence.setStatus(status);
        Evidence saved = evidenceRepository.save(evidence);
        
        auditService.log("Evidence Status Changed", com.precinct12.cms.domain.AuditCategory.EVIDENCE_FLOW,
                "Evidence " + evidence.getTrackingNumber() + " status changed from " + oldStatus + " to " + status,
                "{\"evidence_id\":\"" + id + "\",\"old_status\":\"" + oldStatus + "\",\"new_status\":\"" + status + "\"}");
        
        return saved;
    }

    public boolean verifyChainOfCustody(String evidenceId) {
        Evidence evidence = evidenceRepository.findById(evidenceId)
                .orElseThrow(() -> new IllegalArgumentException("Evidence not found: " + evidenceId));
        
        List<CustodyEvent> chain = custodyEventRepository.findByEvidenceOrderByDateAsc(evidence);
        String previousHash = "GENESIS";
        
        for (CustodyEvent event : chain) {
            String expectedHash = calculateHashFromEvent(previousHash, event);
            if (!expectedHash.equals(event.getHash())) {
                return false;
            }
            previousHash = event.getHash();
        }
        return true;
    }

    private String calculateChainHash(Evidence evidence, String action, String officer, String details) {
        String input = evidence.getId() + "|" + evidence.getTrackingNumber() + "|" + 
                      action + "|" + officer + "|" + details + "|" + LocalDateTime.now().toString();
        return hashSHA256(input);
    }

    private String calculateHashFromEvent(String previousHash, CustodyEvent event) {
        String input = previousHash + "|" + event.getId() + "|" + event.getAction() + "|" + 
                      event.getOfficer() + "|" + event.getDate().toString();
        return hashSHA256(input);
    }

    private String hashSHA256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}