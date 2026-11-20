package com.precinct12.cms.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "custody_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class CustodyEvent extends BaseEntity {

    @Column(name = "event_date", nullable = false)
    private LocalDateTime date;

    @Column(name = "action", nullable = false, columnDefinition = "TEXT")
    private String action;

    @Column(name = "officer", nullable = false, length = 150)
    private String officer;

    @Column(name = "institution", length = 200)
    private String institution;

    @Column(name = "signature", columnDefinition = "TEXT")
    private String signature;

    @Column(name = "hash", length = 64)
    private String hash;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evidence_id", nullable = false)
    private Evidence evidence;
}