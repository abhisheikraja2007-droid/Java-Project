package com.precinct12.cms.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "incidents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class Incident extends BaseEntity {

    @Column(name = "incident_number", nullable = false, unique = true, length = 50)
    private String incidentNumber;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "category", length = 100)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private IncidentStatus status = IncidentStatus.REPORTED;

    @Column(name = "date_created", nullable = false)
    private LocalDate dateCreated = LocalDate.now();

    @Column(name = "narrative", columnDefinition = "TEXT")
    private String narrative;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "address", column = @Column(name = "location_address", length = 200)),
        @AttributeOverride(name = "coordinates", column = @Column(name = "location_coordinates", length = 100)),
        @AttributeOverride(name = "precinct", column = @Column(name = "location_precinct", length = 100))
    })
    private Location location = new Location();

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "name", column = @Column(name = "reporting_officer_name", length = 150)),
        @AttributeOverride(name = "badge", column = @Column(name = "reporting_officer_badge", length = 50)),
        @AttributeOverride(name = "signature", column = @Column(name = "reporting_officer_signature", length = 150))
    })
    private Officer reportingOfficer = new Officer();

    @OneToMany(mappedBy = "incident", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<InvolvedParty> involvedParties = new ArrayList<>();

    @OneToMany(mappedBy = "incident", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<EvidenceSeized> evidenceLog = new ArrayList<>();

    @Embedded
    private ComplianceChecklist complianceChecklist = new ComplianceChecklist();

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Location {
        private String address;
        private String coordinates;
        private String precinct;
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Officer {
        private String name;
        private String badge;
        private String signature;
    }

    @Entity
    @Table(name = "involved_parties")
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @SuperBuilder(toBuilder = true)
    public static class InvolvedParty extends BaseEntity {
        @Column(name = "name", nullable = false, length = 150)
        private String name;

        @Column(name = "role", length = 50)
        private String role;

        @Column(name = "contact", length = 100)
        private String contact;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "incident_id", nullable = false)
        private Incident incident;
    }

    @Entity
    @Table(name = "evidence_seized")
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @SuperBuilder(toBuilder = true)
    public static class EvidenceSeized extends BaseEntity {
        @Column(name = "item", nullable = false, length = 200)
        private String item;

        @Column(name = "serial_number", length = 100)
        private String serialNumber;

        @Column(name = "retrieved_from", length = 200)
        private String retrievedFrom;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "incident_id", nullable = false)
        private Incident incident;
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ComplianceChecklist {
        private boolean mirandaWarning;
        private boolean evidenceBagged;
        private boolean chainInitiated;
        private boolean supervisorNotified;
    }
}