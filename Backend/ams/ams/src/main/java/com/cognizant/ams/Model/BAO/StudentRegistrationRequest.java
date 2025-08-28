package com.cognizant.ams.Model.BAO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentRegistrationRequest {
    private String firstName;
    private String lastName;
    private String gender;
    private LocalDate dob;
    private String email;
    private String contactNumber;
    private String address;
    private String courseID;
}
