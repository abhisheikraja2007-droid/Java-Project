package com.precinct12.cms.repository;

import com.precinct12.cms.domain.CustodyEvent;
import com.precinct12.cms.domain.Evidence;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustodyEventRepository extends JpaRepository<CustodyEvent, String> {

    List<CustodyEvent> findByEvidenceOrderByDateAsc(Evidence evidence);

    List<CustodyEvent> findByEvidenceId(String evidenceId);

    Page<CustodyEvent> findByEvidenceId(String evidenceId, Pageable pageable);

    List<CustodyEvent> findByOfficer(String officer);
}