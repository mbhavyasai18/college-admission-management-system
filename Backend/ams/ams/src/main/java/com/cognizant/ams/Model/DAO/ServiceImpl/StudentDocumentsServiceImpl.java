package com.cognizant.ams.Model.DAO.ServiceImpl;

import com.cognizant.ams.Model.BAO.StudentDocumentDTO;
import com.cognizant.ams.Model.BAO.VerifyDocumentDTO;
import com.cognizant.ams.Model.DAO.Services.StudentDocumentsService;
import com.cognizant.ams.Model.Exceptions.DocumentNotFoundException;
import com.cognizant.ams.Model.POJO.StudentDocuments;
import com.cognizant.ams.Model.POJO.StudentRegistration;
import com.cognizant.ams.Model.Repositories.StudentDocumentsRepository;
import com.cognizant.ams.Model.Repositories.StudentRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StudentDocumentsServiceImpl implements StudentDocumentsService {

    @Autowired
    private StudentDocumentsRepository docRepo;

    @Autowired
    private StudentRegistrationRepository studentRepo;

    @Override
    public StudentDocumentDTO uploadDocument(StudentDocumentDTO dto) {
        StudentRegistration student = studentRepo.findById(dto.getStudentID())
                .orElseThrow(() -> new DocumentNotFoundException("Student not found"));

        String docID = "DOC-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        StudentDocuments doc = new StudentDocuments();
        doc.setDocumentID(docID);
        doc.setStudentRegistration(student);
        doc.setDocumentType(dto.getDocumentType());
        doc.setFilePath(dto.getFilePath());
        doc.setUploadDate(LocalDate.now());
        doc.setVerificationStatus("Pending");

        docRepo.save(doc);

        dto.setDocumentID(docID);
        dto.setUploadDate(LocalDate.now());
        dto.setVerificationStatus("Pending");
        return dto;
    }

    @Override
    public List<StudentDocumentDTO> getDocumentsByStudent(String studentID) {
        return docRepo.findByStudentRegistration_StudentID(studentID).stream().map(doc -> {
            StudentDocumentDTO dto = new StudentDocumentDTO();
            dto.setDocumentID(doc.getDocumentID());
            dto.setStudentID(studentID);
            dto.setDocumentType(doc.getDocumentType());
            dto.setFilePath(doc.getFilePath());
            dto.setUploadDate(doc.getUploadDate());
            dto.setVerificationStatus(doc.getVerificationStatus());
            dto.setVerifiedBy(doc.getVerifiedBy());
            dto.setRemarks(doc.getRemarks());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public StudentDocumentDTO verifyDocument(VerifyDocumentDTO dto) {
        StudentDocuments doc = docRepo.findById(dto.getDocumentID())
                .orElseThrow(() -> new DocumentNotFoundException("Document not found"));

        doc.setVerificationStatus(dto.getVerificationStatus());
        doc.setVerifiedBy(dto.getVerifiedBy());
        doc.setRemarks(dto.getRemarks());
        docRepo.save(doc);

        StudentDocumentDTO result = new StudentDocumentDTO();
        result.setDocumentID(doc.getDocumentID());
        result.setStudentID(doc.getStudentRegistration().getStudentID());
        result.setDocumentType(doc.getDocumentType());
        result.setFilePath(doc.getFilePath());
        result.setUploadDate(doc.getUploadDate());
        result.setVerificationStatus(doc.getVerificationStatus());
        result.setVerifiedBy(doc.getVerifiedBy());
        result.setRemarks(doc.getRemarks());

        return result;
    }
}