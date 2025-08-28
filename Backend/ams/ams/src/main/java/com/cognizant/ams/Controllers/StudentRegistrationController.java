package com.cognizant.ams.Controllers;

import com.cognizant.ams.Model.BAO.StudentRegisterResponse;
import com.cognizant.ams.Model.BAO.StudentRegistrationDTO;
import com.cognizant.ams.Model.DAO.Services.StudentRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentRegistrationController {

    @Autowired
    private StudentRegistrationService service;

    @PostMapping("/register")
    public StudentRegisterResponse register(@RequestBody StudentRegistrationDTO dto) {
        return service.registerStudent(dto);
    }
    @GetMapping("/{studentID}")
    public StudentRegistrationDTO getStudent(@PathVariable String studentID) {
        return service.getStudent(studentID);
    }

    @GetMapping
    public List<StudentRegistrationDTO> getAllStudents() {
        return service.getAllStudents();
    }
}