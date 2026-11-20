package com.precinct12.cms.repository;

import com.precinct12.cms.domain.Case;
import com.precinct12.cms.domain.TimelineEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimelineEventRepository extends JpaRepository<TimelineEvent, String> {

    List<TimelineEvent> findByCaseEntityOrderByDateAsc(Case caseEntity);
}