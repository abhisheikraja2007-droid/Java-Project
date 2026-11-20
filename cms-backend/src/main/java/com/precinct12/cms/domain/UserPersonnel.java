package com.precinct12.cms.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class UserPersonnel extends BaseEntity {

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "email", nullable = false, unique = true, length = 200)
    private String email;

    @Column(name = "department", length = 150)
    private String department;

    @Column(name = "role", length = 100)
    private String role;

    @Column(name = "badge_number", nullable = false, unique = true, length = 50)
    private String badgeNumber;

    @Column(name = "security_score")
    private Integer securityScore = 0;

    @Column(name = "last_active")
    private java.time.LocalDateTime lastActive;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private PersonnelStatus status = PersonnelStatus.ACTIVE;

    @ElementCollection
    @CollectionTable(name = "user_permissions", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "permission", length = 50)
    @Builder.Default
    private List<String> permissions = new ArrayList<>();

    @Column(name = "password_hash", length = 255)
    private String passwordHash;
}