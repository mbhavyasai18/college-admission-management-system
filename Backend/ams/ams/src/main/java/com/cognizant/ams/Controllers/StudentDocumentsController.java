package com.cognizant.ams.Controllers;

import com.cognizant.ams.Model.BAO.StudentDocumentDTO;
import com.cognizant.ams.Model.BAO.VerifyDocumentDTO;
import com.cognizant.ams.Model.DAO.Services.StudentDocumentsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class StudentDocumentsController {

    @Autowired
    private StudentDocumentsService service;

    @PostMapping("/upload")
    public StudentDocumentDTO upload(@RequestBody StudentDocumentDTO dto) {
        return service.uploadDocument(dto);
    }

    @GetMapping("/{studentID}")
    public List<StudentDocumentDTO> getByStudent(@PathVariable String studentID) {
        return service.getDocumentsByStudent(studentID);
    }

    @PostMapping("/verify")
    public StudentDocumentDTO verify(@RequestBody VerifyDocumentDTO dto) {
        return service.verifyDocument(dto);
    }
}