package com.precinct12.cms.repository;

import com.precinct12.cms.domain.Evidence;
import com.precinct12.cms.domain.EvidenceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EvidenceRepository extends JpaRepository<Evidence, String> {

    Optional<Evidence> findByTrackingNumber(String trackingNumber);

    List<Evidence> findByStatus(EvidenceStatus status);

    List<Evidence> findByCaseId(String caseId);

    List<Evidence> findByCategory(String category);

    @Query("SELECT e FROM Evidence e WHERE " +
           "LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.trackingNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.caseId) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Evidence> searchEvidence(@Param("search") String search, Pageable pageable);

    @Query("SELECT e FROM Evidence e WHERE " +
           "(:status IS NULL OR e.status = :status) AND " +
           "(:category IS NULL OR e.category = :category) AND " +
           "(:search IS NULL OR " +
           "   LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "   LOWER(e.trackingNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "   LOWER(e.caseId) LIKE LOWER(CONCAT('%', :search, '%'))" +
           ")")
    Page<Evidence> findWithFilters(
            @Param("status") EvidenceStatus status,
            @Param("category") String category,
            @Param("search") String search,
            Pageable pageable);

    List<Evidence> findByRetentionDateBefore(LocalDateTime date);
}