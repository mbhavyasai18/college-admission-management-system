package com.cognizant.ams.Model.BAO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserLoginResponse {
    private String userID;
    private String username;
    private String role;
}
