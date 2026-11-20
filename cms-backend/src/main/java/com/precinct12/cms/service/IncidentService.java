package com.precinct12.cms.service;

import com.precinct12.cms.domain.Case;
import com.precinct12.cms.domain.Incident;
import com.precinct12.cms.domain.IncidentStatus;
import com.precinct12.cms.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final AuditService auditService;
    private final CaseService caseService;

    public Page<Incident> findAll(Pageable pageable) {
        return incidentRepository.findAll(pageable);
    }

    public Page<Incident> search(String query, Pageable pageable) {
        return incidentRepository.searchIncidents(query, pageable);
    }

    public Optional<Incident> findById(String id) {
        return incidentRepository.findById(id);
    }

    public Optional<Incident> findByIncidentNumber(String incidentNumber) {
        return incidentRepository.findByIncidentNumber(incidentNumber);
    }

    public List<Incident> findByStatus(IncidentStatus status) {
        return incidentRepository.findByStatus(status);
    }

    public List<Incident> findByDateRange(LocalDate start, LocalDate end) {
        return incidentRepository.findByDateCreatedBetween(start, end);
    }

    @Transactional
    public Incident create(Incident incident) {
        if (incident.getIncidentNumber() == null || incident.getIncidentNumber().isBlank()) {
            incident.setIncidentNumber("INC-" + LocalDate.now().getYear() + "-" + 
                String.format("%04d", (int)(Math.random() * 10000)));
        }
        if (incident.getDateCreated() == null) {
            incident.setDateCreated(LocalDate.now());
        }
        Incident saved = incidentRepository.save(incident);
        auditService.log("Incident Reported", com.precinct12.cms.domain.AuditCategory.DATA_CHANGE,
                "Filed incident report: " + saved.getIncidentNumber() + " - " + saved.getTitle(),
                "{\"incident_id\":\"" + saved.getId() + "\"}");
        return saved;
    }

    @Transactional
    public Incident promoteToCase(String incidentId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new IllegalArgumentException("Incident not found: " + incidentId));
        
        if (incident.getStatus() == IncidentStatus.CASE_CREATED) {
            throw new IllegalStateException("Incident already promoted to case");
        }
        
        Case newCase = caseService.promoteFromIncident(incident);
        incident.setStatus(IncidentStatus.CASE_CREATED);
        Incident saved = incidentRepository.save(incident);
        
        auditService.log("Incident Promoted to Case", com.precinct12.cms.domain.AuditCategory.DATA_CHANGE,
                "Incident " + incident.getIncidentNumber() + " promoted to case " + newCase.getCaseNumber(),
                "{\"incident_id\":\"" + incidentId + "\",\"case_id\":\"" + newCase.getId() + "\"}");
        
        return saved;
    }

    @Transactional
    public Incident update(String id, Incident updates) {
        Incident existing = incidentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Incident not found: " + id));
        
        existing.setTitle(updates.getTitle());
        existing.setCategory(updates.getCategory());
        existing.setStatus(updates.getStatus());
        existing.setNarrative(updates.getNarrative());
        existing.setLocation(updates.getLocation());
        existing.setReportingOfficer(updates.getReportingOfficer());
        existing.setInvolvedParties(updates.getInvolvedParties());
        existing.setEvidenceLog(updates.getEvidenceLog());
        existing.setComplianceChecklist(updates.getComplianceChecklist());
        
        Incident saved = incidentRepository.save(existing);
        auditService.log("Incident Updated", com.precinct12.cms.domain.AuditCategory.DATA_CHANGE,
                "Updated incident: " + saved.getIncidentNumber(),
                "{\"incident_id\":\"" + saved.getId() + "\"}");
        return saved;
    }
}