package com.userauth_services.userauth_services.Model.DAO.ServiceImple;

import com.userauth_services.userauth_services.Model.Pojo.OurUsers;
import com.userauth_services.userauth_services.Model.repositories.UserRepository;
import com.userauth_services.userauth_services.config.OurUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserDetailsService { // Implements the correct interface

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        OurUsers user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return new OurUserDetails(user);
    }
}