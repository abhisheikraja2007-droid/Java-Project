package com.precinct12.cms.repository;

import com.precinct12.cms.domain.AuditLog;
import com.precinct12.cms.domain.AuditCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, String> {

    List<AuditLog> findByCategory(AuditCategory category);

    List<AuditLog> findByUser(String user);

    List<AuditLog> findByIpAddress(String ipAddress);

    @Query("SELECT a FROM AuditLog a WHERE " +
           "LOWER(a.event) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.user) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.details) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<AuditLog> searchLogs(@Param("search") String search, Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:category IS NULL OR a.category = :category) AND " +
           "(:search IS NULL OR " +
           "   LOWER(a.event) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "   LOWER(a.user) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "   LOWER(a.details) LIKE LOWER(CONCAT('%', :search, '%'))" +
           ")")
    Page<AuditLog> findWithFilters(
            @Param("category") AuditCategory category,
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.timestamp BETWEEN :start AND :end ORDER BY a.timestamp DESC")
    Page<AuditLog> findByTimestampBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable);

    List<AuditLog> findTop100ByOrderByTimestampDesc();
}