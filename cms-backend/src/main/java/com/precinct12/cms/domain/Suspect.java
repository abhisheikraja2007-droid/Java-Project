package com.precinct12.cms.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "suspects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class Suspect extends BaseEntity {

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "age")
    private Integer age;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "risk_level", length = 20)
    private String riskLevel;

    @Column(name = "mugshot_url", length = 500)
    private String mugshotUrl;

    @ElementCollection
    @CollectionTable(name = "suspect_aliases", joinColumns = @JoinColumn(name = "suspect_id"))
    @Column(name = "alias", length = 100)
    @Builder.Default
    private List<String> aliasHistory = new ArrayList<>();

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "height", column = @Column(name = "height", length = 20)),
        @AttributeOverride(name = "weight", column = @Column(name = "weight", length = 20)),
        @AttributeOverride(name = "eyeColor", column = @Column(name = "eye_color", length = 20)),
        @AttributeOverride(name = "hairColor", column = @Column(name = "hair_color", length = 20)),
        @AttributeOverride(name = "scars", column = @Column(name = "scars", length = 200)),
        @AttributeOverride(name = "fingerprintsId", column = @Column(name = "fingerprints_id", length = 50))
    })
    private PhysicalData physicalData = new PhysicalData();

    @OneToMany(mappedBy = "suspect", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("date DESC")
    @Builder.Default
    private List<CriminalRecordItem> criminalRecord = new ArrayList<>();

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PhysicalData {
        private String height;
        private String weight;
        private String eyeColor;
        private String hairColor;
        private String scars;
        private String fingerprintsId;
    }

    @Entity
    @Table(name = "criminal_records")
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @SuperBuilder(toBuilder = true)
    public static class CriminalRecordItem extends BaseEntity {
        @Column(name = "record_date", nullable = false)
        private java.time.LocalDate date;

        @Column(name = "offense", nullable = false, length = 200)
        private String offense;

        @Column(name = "disposition", length = 200)
        private String disposition;

        @Column(name = "case_number", length = 50)
        private String caseNumber;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "suspect_id", nullable = false)
        private Suspect suspect;
    }
}