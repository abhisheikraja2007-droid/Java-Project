package com.precinct12.cms.controller;

import com.precinct12.cms.domain.UserPersonnel;
import com.precinct12.cms.security.JwtTokenProvider;
import com.precinct12.cms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/cms/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtTokenProvider.generateToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        UserPersonnel user = userService.findByEmail(request.email()).orElseThrow();
        userService.updateLastActive(user.getId());

        return ResponseEntity.ok(new AuthResponse(token, refreshToken, user.getId(), user.getName(), user.getRole(), user.getPermissions()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@RequestBody RefreshRequest request) {
        if (!jwtTokenProvider.validateToken(request.refreshToken())) {
            return ResponseEntity.status(401).build();
        }
        String email = jwtTokenProvider.extractUsername(request.refreshToken());
        UserPersonnel user = userService.findByEmail(email).orElseThrow();
        
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .authorities(user.getPermissions().stream().map(SimpleGrantedAuthority::new).toList())
                .build();
        
        String newToken = jwtTokenProvider.generateToken(userDetails);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(userDetails);
        return ResponseEntity.ok(new TokenResponse(newToken, newRefreshToken));
    }

    record LoginRequest(String email, String password) {}
    record RefreshRequest(String refreshToken) {}
    record AuthResponse(String token, String refreshToken, String userId, String name, String role, List<String> permissions) {}
    record TokenResponse(String token, String refreshToken) {}
}