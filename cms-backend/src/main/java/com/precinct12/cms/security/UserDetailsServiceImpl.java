package com.precinct12.cms.security;

import com.precinct12.cms.domain.UserPersonnel;
import com.precinct12.cms.repository.UserPersonnelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserPersonnelRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserPersonnel user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        if (user.getStatus() != com.precinct12.cms.domain.PersonnelStatus.ACTIVE) {
            throw new UsernameNotFoundException("User account is not active: " + email);
        }
        
        List<SimpleGrantedAuthority> authorities = user.getPermissions().stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
        
        return new User(user.getEmail(), user.getPasswordHash(), authorities);
    }

    public UserPersonnel getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}