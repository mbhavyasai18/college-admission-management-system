package com.cognizant.ams.Model.BAO;

import lombok.Data;

@Data
public class VerifyDocumentDTO {
    private String documentID;
    private String verificationStatus;  // Verified / Rejected
    private String verifiedBy;
    private String remarks;
}
