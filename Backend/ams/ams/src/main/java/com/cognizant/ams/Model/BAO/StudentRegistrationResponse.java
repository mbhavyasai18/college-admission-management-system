package com.cognizant.ams.Model.BAO;

import lombok.Data;

@Data
public class StudentRegistrationResponse {
    private String studentID;
    private String fullName;
    private String username;
    private String password;
    private String message;
}
