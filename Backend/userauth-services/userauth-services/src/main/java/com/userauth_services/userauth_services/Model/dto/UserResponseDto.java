package com.userauth_services.userauth_services.Model.dto;

import lombok.Data;

@Data
public class UserResponseDto {
    private String jwt;
    private String role;
    private String userID; // Field was added here

    public UserResponseDto(String jwt, String role, String userID) {
        this.jwt = jwt;
        this.role = role;
        this.userID = userID; // And added to the constructor
    }
}