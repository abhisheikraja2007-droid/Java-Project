package com.precinct12.cms.service;

import com.precinct12.cms.domain.Case;
import com.precinct12.cms.domain.TimelineEvent;
import com.precinct12.cms.repository.CaseRepository;
import com.precinct12.cms.repository.TimelineEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CaseService {

    private final CaseRepository caseRepository;
    private final TimelineEventRepository timelineEventRepository;
    private final AuditService auditService;

    public Page<Case> findAll(Pageable pageable) {
        return caseRepository.findAll(pageable);
    }

    public Page<Case> findWithFilters(Case.CaseStatus status, Case.Priority priority, String search, Pageable pageable) {
        return caseRepository.findWithFilters(status, priority, search, pageable);
    }

    public Optional<Case> findById(String id) {
        return caseRepository.findById(id);
    }

    public Optional<Case> findByCaseNumber(String caseNumber) {
        return caseRepository.findByCaseNumber(caseNumber);
    }

    @Transactional
    public Case create(Case caseEntity) {
        if (caseEntity.getCaseNumber() == null || caseEntity.getCaseNumber().isBlank()) {
            caseEntity.setCaseNumber("CMS-" + LocalDateTime.now().getYear() + "-" + (1000 + (int)(Math.random() * 9000)));
        }
        if (caseEntity.getDateCreated() == null) {
            caseEntity.setDateCreated(LocalDateTime.now());
        }
        Case saved = caseRepository.save(caseEntity);
        auditService.log("Case Created", com.precinct12.cms.domain.AuditCategory.DATA_CHANGE,
                "Created case " + saved.getCaseNumber() + ": " + saved.getTitle(),
                "{\"case_id\":\"" + saved.getId() + "\"}");
        return saved;
    }

    @Transactional
    public Case update(String id, Case updates) {
        Case existing = caseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Case not found: " + id));
        
        existing.setTitle(updates.getTitle());
        existing.setDescription(updates.getDescription());
        existing.setStatus(updates.getStatus());
        existing.setPriority(updates.getPriority());
        existing.setInvestigatingTeam(updates.getInvestigatingTeam());
        existing.setPrimarySuspectId(updates.getPrimarySuspectId());
        existing.setEvidenceIds(updates.getEvidenceIds());
        
        Case saved = caseRepository.save(existing);
        auditService.log("Case Updated", com.precinct12.cms.domain.AuditCategory.DATA_CHANGE,
                "Updated case " + saved.getCaseNumber(),
                "{\"case_id\":\"" + saved.getId() + "\"}");
        return saved;
    }

    @Transactional
    public void delete(String id) {
        Case existing = caseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Case not found: " + id));
        String caseNumber = existing.getCaseNumber();
        caseRepository.deleteById(id);
        auditService.log("Case Deleted", com.precinct12.cms.domain.AuditCategory.DATA_CHANGE,
                "Deleted case " + caseNumber,
                "{\"case_id\":\"" + id + "\"}");
    }

    @Transactional
    public Case addTimelineEvent(String caseId, TimelineEvent event) {
        Case caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseId));
        
        event.setCaseEntity(caseEntity);
        event.setDate(LocalDateTime.now());
        TimelineEvent saved = timelineEventRepository.save(event);
        
        caseEntity.getTimeline().add(saved);
        Case updated = caseRepository.save(caseEntity);
        
        auditService.log("Case Timeline Updated", com.precinct12.cms.domain.AuditCategory.DATA_CHANGE,
                "Added investigative diary event: " + event.getTitle() + " to Case " + caseEntity.getCaseNumber(),
                "{\"case_id\":\"" + caseId + "\",\"event_id\":\"" + saved.getId() + "\"}");
        return updated;
    }

    @Transactional
    public Case promoteFromIncident(com.precinct12.cms.domain.Incident incident) {
        Case newCase = Case.builder()
                .title(incident.getTitle())
                .description("Investigation initiated from Incident report " + incident.getIncidentNumber() + ". Briefing: " + incident.getNarrative())
                .status(Case.CaseStatus.ACTIVE)
                .priority(Case.Priority.HIGH)
                .investigatingTeam("Precinct 12 Robbery Investigations")
                .primarySuspectId("SP-9012")
                .dateCreated(LocalDateTime.now())
                .build();
        
        Case saved = create(newCase);
        
        TimelineEvent entry = TimelineEvent.builder()
                .title("Investigation Initiated from Incident Report")
                .description("Case created from filed incident " + incident.getIncidentNumber() + " by " + incident.getReportingOfficer().getName())
                .officer(incident.getReportingOfficer().getName())
                .date(LocalDateTime.now())
                .build();
        addTimelineEvent(saved.getId(), entry);
        
        auditService.log("Incident Transferred to Case", com.precinct12.cms.domain.AuditCategory.DATA_CHANGE,
                "Filer report " + incident.getIncidentNumber() + " successfully promoted to active case " + saved.getCaseNumber(),
                "{\"incident_id\":\"" + incident.getId() + "\",\"case_id\":\"" + saved.getId() + "\"}");
        
        return saved;
    }
}