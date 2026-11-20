package com.precinct12.cms.controller;

import com.precinct12.cms.domain.UserPersonnel;
import com.precinct12.cms.domain.PersonnelStatus;
import com.precinct12.cms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cms/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) PersonnelStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        if (department != null) {
            return ResponseEntity.ok(userService.findByDepartment(department));
        }
        if (role != null) {
            return ResponseEntity.ok(userService.findByRole(role));
        }
        if (status != null) {
            return ResponseEntity.ok(userService.findByStatus(status));
        }
        return ResponseEntity.ok(userService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<UserPersonnel> getById(@PathVariable String id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/badge/{badgeNumber}")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<UserPersonnel> getByBadgeNumber(@PathVariable String badgeNumber) {
        return userService.findByBadgeNumber(badgeNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<UserPersonnel> create(@RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(userService.create(request.user(), request.password()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<UserPersonnel> update(@PathVariable String id, @RequestBody UserPersonnel updates) {
        return ResponseEntity.ok(userService.update(id, updates));
    }

    @PostMapping("/{id}/password")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<Void> changePassword(@PathVariable String id, @RequestBody PasswordRequest request) {
        userService.changePassword(id, request.newPassword());
        return ResponseEntity.ok().build();
    }

    record CreateUserRequest(UserPersonnel user, String password) {}
    record PasswordRequest(String newPassword) {}
}