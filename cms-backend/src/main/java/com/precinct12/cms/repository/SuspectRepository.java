package com.precinct12.cms.repository;

import com.precinct12.cms.domain.Suspect;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SuspectRepository extends JpaRepository<Suspect, String> {

    List<Suspect> findByStatus(String status);

    List<Suspect> findByRiskLevel(String riskLevel);

    @Query("SELECT s FROM Suspect s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "EXISTS (SELECT 1 FROM s.aliasHistory a WHERE LOWER(a) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Suspect> searchSuspects(@Param("search") String search, Pageable pageable);

    List<Suspect> findByAliasHistoryContaining(String alias);

    Optional<Suspect> findByFingerprintsId(String fingerprintsId);
}