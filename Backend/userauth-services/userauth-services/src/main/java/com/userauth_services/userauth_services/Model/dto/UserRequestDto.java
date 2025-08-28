package com.userauth_services.userauth_services.Model.dto;

import lombok.Data;

@Data
public class UserRequestDto {
    private String username;
    private String password;
    private String role; // Add this field
}