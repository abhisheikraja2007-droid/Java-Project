package com.precinct12.cms.repository;

import com.precinct12.cms.domain.Incident;
import com.precinct12.cms.domain.IncidentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, String> {

    Optional<Incident> findByIncidentNumber(String incidentNumber);

    List<Incident> findByStatus(IncidentStatus status);

    List<Incident> findByCategory(String category);

    @Query("SELECT i FROM Incident i WHERE " +
           "LOWER(i.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(i.incidentNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(i.narrative) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(i.category) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Incident> searchIncidents(@Param("search") String search, Pageable pageable);

    List<Incident> findByDateCreatedBetween(LocalDate start, LocalDate end);
}