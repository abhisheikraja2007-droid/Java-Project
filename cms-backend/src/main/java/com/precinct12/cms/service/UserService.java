package com.precinct12.cms.service;

import com.precinct12.cms.domain.UserPersonnel;
import com.precinct12.cms.domain.PersonnelStatus;
import com.precinct12.cms.repository.UserPersonnelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserPersonnelRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public Page<UserPersonnel> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public Optional<UserPersonnel> findById(String id) {
        return userRepository.findById(id);
    }

    public Optional<UserPersonnel> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<UserPersonnel> findByBadgeNumber(String badgeNumber) {
        return userRepository.findByBadgeNumber(badgeNumber);
    }

    public List<UserPersonnel> findByDepartment(String department) {
        return userRepository.findByDepartment(department);
    }

    public List<UserPersonnel> findByRole(String role) {
        return userRepository.findByRole(role);
    }

    public List<UserPersonnel> findByStatus(PersonnelStatus status) {
        return userRepository.findByStatus(status);
    }

    @Transactional
    public UserPersonnel create(UserPersonnel user, String rawPassword) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + user.getEmail());
        }
        if (userRepository.existsByBadgeNumber(user.getBadgeNumber())) {
            throw new IllegalArgumentException("Badge number already exists: " + user.getBadgeNumber());
        }
        
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setSecurityScore(calculateInitialScore(user));
        user.setLastActive(LocalDateTime.now());
        
        UserPersonnel saved = userRepository.save(user);
        auditService.log("User Created", com.precinct12.cms.domain.AuditCategory.SECURITY,
                "Created user account: " + saved.getName() + " (" + saved.getBadgeNumber() + ")",
                "{\"user_id\":\"" + saved.getId() + "\"}");
        return saved;
    }

    @Transactional
    public UserPersonnel update(String id, UserPersonnel updates) {
        UserPersonnel existing = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        
        existing.setName(updates.getName());
        existing.setDepartment(updates.getDepartment());
        existing.setRole(updates.getRole());
        existing.setSecurityScore(updates.getSecurityScore());
        existing.setStatus(updates.getStatus());
        existing.setPermissions(updates.getPermissions());
        
        UserPersonnel saved = userRepository.save(existing);
        auditService.log("User Updated", com.precinct12.cms.domain.AuditCategory.ACCESS,
                "Updated user: " + saved.getName() + " (" + saved.getBadgeNumber() + ")",
                "{\"user_id\":\"" + saved.getId() + "\"}");
        return saved;
    }

    @Transactional
    public UserPersonnel updateLastActive(String id) {
        UserPersonnel existing = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        existing.setLastActive(LocalDateTime.now());
        return userRepository.save(existing);
    }

    @Transactional
    public void changePassword(String id, String newRawPassword) {
        UserPersonnel existing = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        existing.setPasswordHash(passwordEncoder.encode(newRawPassword));
        userRepository.save(existing);
        auditService.log("Password Changed", com.precinct12.cms.domain.AuditCategory.SECURITY,
                "Password changed for user: " + existing.getName(),
                "{\"user_id\":\"" + id + "\"}");
    }

    private int calculateInitialScore(UserPersonnel user) {
        int score = 50;
        if (user.getRole() != null && user.getRole().contains("Command")) score += 20;
        if (user.getRole() != null && user.getRole().contains("Inspector")) score += 15;
        if (user.getPermissions() != null) score += user.getPermissions().size() * 2;
        return Math.min(100, score);
    }
}