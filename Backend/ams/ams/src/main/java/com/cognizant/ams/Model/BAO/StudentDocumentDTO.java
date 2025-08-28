package com.cognizant.ams.Model.BAO;

import lombok.Data;
import java.time.LocalDate;

@Data
public class StudentDocumentDTO {
    private String documentID;
    private String studentID;
    private String documentType;
    private String filePath;
    private LocalDate uploadDate;
    private String verificationStatus;
    private String verifiedBy;
    private String remarks;
}
