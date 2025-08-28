package com.cognizant.ams.Model.DAO.Services;

import com.cognizant.ams.Model.BAO.StudentDocumentDTO;
import com.cognizant.ams.Model.BAO.VerifyDocumentDTO;

import java.util.List;

public interface StudentDocumentsService {
    StudentDocumentDTO uploadDocument(StudentDocumentDTO dto);
    List<StudentDocumentDTO> getDocumentsByStudent(String studentID);
    StudentDocumentDTO verifyDocument(VerifyDocumentDTO dto);
}
