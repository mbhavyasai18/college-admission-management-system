package com.cognizant.ams.Model.BAO;

import lombok.Data;

@Data
public class AdmissionDecisionDTO {
    private String studentID;
    private String status; // Accepted / Rejected
    private Integer concession; // Optional
}
