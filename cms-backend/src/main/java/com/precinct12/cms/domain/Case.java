package com.precinct12.cms.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "cases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class Case extends BaseEntity {

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "case_number", nullable = false, unique = true, length = 50)
    private String caseNumber;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private CaseStatus status = CaseStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false, length = 20)
    private Priority priority = Priority.MEDIUM;

    @Column(name = "investigating_team", length = 150)
    private String investigatingTeam;

    @Column(name = "primary_suspect_id", length = 36)
    private String primarySuspectId;

    @ElementCollection
    @CollectionTable(name = "case_evidence_ids", joinColumns = @JoinColumn(name = "case_id"))
    @Column(name = "evidence_id", length = 36)
    @Builder.Default
    private List<String> evidenceIds = new ArrayList<>();

    @Column(name = "date_created", nullable = false)
    private LocalDateTime dateCreated = LocalDateTime.now();

    @OneToMany(mappedBy = "caseEntity", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("date ASC")
    @Builder.Default
    private List<TimelineEvent> timeline = new ArrayList<>();

    public enum CaseStatus {
        ACTIVE, CLOSED, COLD, UNDER_INVESTIGATION
    }

    public enum Priority {
        HIGH, MEDIUM, LOW
    }
}