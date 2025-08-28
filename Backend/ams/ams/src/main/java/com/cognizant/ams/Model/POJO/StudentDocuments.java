package com.cognizant.ams.Model.POJO;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "tblStudent_Documents")
@Data
public class StudentDocuments {

    @Id
    @Column(name = "DocumentID", nullable = false, length = 10)
    private String documentID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "StudentID", nullable = false)
    private StudentRegistration studentRegistration;

    @Column(name = "DocumentType", nullable = false, length = 30)
    private String documentType;

    // The 'documentName' field has been removed.

    @Column(name = "FilePath", nullable = false, length = 200)
    private String filePath;

    @Column(name = "UploadDate", nullable = false)
    private LocalDate uploadDate;

    @Column(name = "VerifiedBy", length = 30)
    private String verifiedBy;

    @Column(name = "VerificationStatus", nullable = false, length = 20)
    private String verificationStatus;

    @Column(name = "Remarks", length = 200)
    private String remarks;
}