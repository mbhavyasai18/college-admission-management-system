package com.cognizant.ams.Model.BAO;

import lombok.Data;

@Data
public class StudentRegisterResponse {
    private String studentID;
    private String username;
    private String password;

    // --- THIS IS THE FIX ---
    // This constructor matches the arguments in your service class.
    public StudentRegisterResponse(String studentID, String username, String password) {
        this.studentID = studentID;
        this.username = username;
        this.password = password;
    }
}