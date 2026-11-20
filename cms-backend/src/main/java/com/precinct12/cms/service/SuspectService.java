package com.precinct12.cms.service;

import com.precinct12.cms.domain.Suspect;
import com.precinct12.cms.domain.Suspect.CriminalRecordItem;
import com.precinct12.cms.repository.SuspectRepository;
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
public class SuspectService {

    private final SuspectRepository suspectRepository;
    private final AuditService auditService;

    public Page<Suspect> findAll(Pageable pageable) {
        return suspectRepository.findAll(pageable);
    }

    public Page<Suspect> search(String query, Pageable pageable) {
        return suspectRepository.searchSuspects(query, pageable);
    }

    public Optional<Suspect> findById(String id) {
        return suspectRepository.findById(id);
    }

    public List<Suspect> findByStatus(String status) {
        return suspectRepository.findByStatus(status);
    }

    public List<Suspect> findByRiskLevel(String riskLevel) {
        return suspectRepository.findByRiskLevel(riskLevel);
    }

    @Transactional
    public Suspect create(Suspect suspect) {
        Suspect saved = suspectRepository.save(suspect);
        auditService.log("Suspect Created", com.precinct12.cms.domain.AuditCategory.DATA_CHANGE,
                "Created suspect profile: " + saved.getName() + " (" + saved.getId() + ")",
                "{\"suspect_id\":\"" + saved.getId() + "\"}");
        return saved;
    }

    @Transactional
    public Suspect update(String id, Suspect updates) {
        Suspect existing = suspectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Suspect not found: " + id));
        
        existing.setName(updates.getName());
        existing.setAge(updates.getAge());
        existing.setGender(updates.getGender());
        existing.setStatus(updates.getStatus());
        existing.setRiskLevel(updates.getRiskLevel());
        existing.setMugshotUrl(updates.getMugshotUrl());
        existing.setPhysicalData(updates.getPhysicalData());
        
        Suspect saved = suspectRepository.save(existing);
        auditService.log("Suspect Updated", com.precinct12.cms.domain.AuditCategory.DATA_CHANGE,
                "Updated suspect profile: " + saved.getName(),
                "{\"suspect_id\":\"" + saved.getId() + "\"}");
        return saved;
    }

    @Transactional
    public Suspect addAlias(String suspectId, String alias) {
        Suspect suspect = suspectRepository.findById(suspectId)
                .orElseThrow(() -> new IllegalArgumentException("Suspect not found: " + suspectId));
        
        suspect.getAliasHistory().add(alias);
        Suspect saved = suspectRepository.save(suspect);
        
        auditService.log("Suspect Alias Added", com.precinct12.cms.domain.AuditCategory.DATA_CHANGE,
                "Added alias \"" + alias + "\" to suspect " + suspect.getName(),
                "{\"suspect_id\":\"" + suspectId + "\",\"alias\":\"" + alias + "\"}");
        return saved;
    }

    @Transactional
    public Suspect addCriminalRecord(String suspectId, CriminalRecordItem record) {
        Suspect suspect = suspectRepository.findById(suspectId)
                .orElseThrow(() -> new IllegalArgumentException("Suspect not found: " + suspectId));
        
        record.setSuspect(suspect);
        record.setDate(LocalDate.now());
        suspect.getCriminalRecord().add(0, record);
        
        Suspect saved = suspectRepository.save(suspect);
        
        auditService.log("Suspect Conviction Logged", com.precinct12.cms.domain.AuditCategory.DATA_CHANGE,
                "Logged offense \"" + record.getOffense() + "\" in criminal record of " + suspect.getName(),
                "{\"suspect_id\":\"" + suspectId + "\",\"offense\":\"" + record.getOffense() + "\"}");
        return saved;
    }

    @Transactional
    public void delete(String id) {
        Suspect existing = suspectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Suspect not found: " + id));
        String name = existing.getName();
        suspectRepository.deleteById(id);
        auditService.log("Suspect Deleted", com.precinct12.cms.domain.AuditCategory.DATA_CHANGE,
                "Deleted suspect profile: " + name,
                "{\"suspect_id\":\"" + id + "\"}");
    }
}