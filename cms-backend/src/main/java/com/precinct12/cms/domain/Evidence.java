package com.precinct12.cms.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "evidence")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class Evidence extends BaseEntity {

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "tracking_number", nullable = false, unique = true, length = 50)
    private String trackingNumber;

    @Column(name = "case_id", length = 36)
    private String caseId;

    @Column(name = "category", length = 100)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private EvidenceStatus status = EvidenceStatus.IN_STORAGE;

    @Column(name = "location", length = 150)
    private String location;

    @Column(name = "capacity_code", length = 50)
    private String capacityCode;

    @Column(name = "retention_date")
    private LocalDateTime retentionDate;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "checked_out_by", length = 150)
    private String checkedOutBy;

    @Column(name = "check_out_date")
    private LocalDateTime checkOutDate;

    @Column(name = "expected_return_date")
    private LocalDateTime expectedReturnDate;

    @OneToMany(mappedBy = "evidence", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("date ASC")
    @Builder.Default
    private java.util.List<CustodyEvent> chainOfCustody = new java.util.ArrayList<>();
}