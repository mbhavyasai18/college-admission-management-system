package com.cognizant.ams.Model.BAO;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AdmissionStatusDTO {
    private String studentID;
    private String courseID;
    private String status;
    private Integer concession;
    private LocalDate approvedDate;
}
