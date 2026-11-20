package com.precinct12.cms.repository;

import com.precinct12.cms.domain.UserPersonnel;
import com.precinct12.cms.domain.PersonnelStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPersonnelRepository extends JpaRepository<UserPersonnel, String> {

    Optional<UserPersonnel> findByEmail(String email);

    Optional<UserPersonnel> findByBadgeNumber(String badgeNumber);

    List<UserPersonnel> findByDepartment(String department);

    List<UserPersonnel> findByRole(String role);

    List<UserPersonnel> findByStatus(PersonnelStatus status);

    List<UserPersonnel> findByPermissionsContaining(String permission);

    boolean existsByEmail(String email);

    boolean existsByBadgeNumber(String badgeNumber);
}