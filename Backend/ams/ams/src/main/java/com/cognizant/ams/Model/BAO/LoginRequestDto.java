package com.cognizant.ams.Model.BAO;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String username;
    private String password;
}