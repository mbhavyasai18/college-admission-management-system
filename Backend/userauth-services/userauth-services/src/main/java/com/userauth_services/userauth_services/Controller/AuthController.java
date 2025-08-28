package com.userauth_services.userauth_services.Controller;

import com.userauth_services.userauth_services.Model.DAO.ServiceImple.JwtService;
import com.userauth_services.userauth_services.Model.Pojo.OurUsers;
import com.userauth_services.userauth_services.Model.dto.UserRequestDto;
import com.userauth_services.userauth_services.Model.dto.UserResponseDto;
import com.userauth_services.userauth_services.config.OurUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<UserResponseDto> createAuthenticationToken(@RequestBody UserRequestDto authRequest) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        final String jwt = jwtService.generateToken(userDetails);
        final String role = userDetails.getAuthorities().stream().findFirst().get().getAuthority();

        // --- THIS LOGIC WAS UPDATED ---
        String userId = "";
        if (userDetails instanceof OurUserDetails) {
            // We cast the UserDetails to our custom class to access the new getUserId() method
            userId = ((OurUserDetails) userDetails).getUserId();
        }

        // Return the response with the token, role, AND userID
        return ResponseEntity.ok(new UserResponseDto(jwt, role, userId));
    }
}