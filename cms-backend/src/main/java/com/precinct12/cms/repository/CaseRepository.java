package com.precinct12.cms.repository;

import com.precinct12.cms.domain.Case;
import com.precinct12.cms.domain.Case.CaseStatus;
import com.precinct12.cms.domain.Case.Priority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CaseRepository extends JpaRepository<Case, String> {

    Optional<Case> findByCaseNumber(String caseNumber);

    List<Case> findByStatus(CaseStatus status);

    List<Case> findByPriority(Priority priority);

    @Query("SELECT c FROM Case c WHERE " +
           "LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.caseNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.investigatingTeam) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Case> searchCases(@Param("search") String search, Pageable pageable);

    @Query("SELECT c FROM Case c WHERE " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:priority IS NULL OR c.priority = :priority) AND " +
           "(:search IS NULL OR " +
           "   LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "   LOWER(c.caseNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "   LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "   LOWER(c.investigatingTeam) LIKE LOWER(CONCAT('%', :search, '%'))" +
           ")")
    Page<Case> findWithFilters(
            @Param("status") CaseStatus status,
            @Param("priority") Priority priority,
            @Param("search") String search,
            Pageable pageable);

    List<Case> findByPrimarySuspectId(String suspectId);

    List<Case> findByEvidenceIdsContains(String evidenceId);
}