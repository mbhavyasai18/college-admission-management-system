package com.cognizant.ams.Model.DAO.ServiceImpl;

import com.cognizant.ams.Model.BAO.StudentRegistrationDTO;
import com.cognizant.ams.Model.BAO.StudentRegisterResponse;
import com.cognizant.ams.Model.DAO.Services.StudentRegistrationService;
import com.cognizant.ams.Model.POJO.*;
import com.cognizant.ams.Model.Repositories.CourseMasterRepository;
import com.cognizant.ams.Model.Repositories.StudentRegistrationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StudentRegistrationServiceImpl implements StudentRegistrationService {

    @Autowired
    private StudentRegistrationRepository studentRepo;

    @Autowired
    private CourseMasterRepository courseRepo;

    @Override
    public StudentRegisterResponse registerStudent(StudentRegistrationDTO dto) {
        CourseMaster course = courseRepo.findById(dto.getCourseID())
                .orElseThrow(() -> new EntityNotFoundException("Course not found with ID: " + dto.getCourseID()));

        String studentId = "STU-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        UserLogin newUser = new UserLogin();
        newUser.setUserID(studentId);
        newUser.setUsername(dto.getEmail());
        newUser.setPassword("defaultPass123"); // Direct plain text password
        newUser.setRole("Student");

        StudentRegistration student = new StudentRegistration();
        student.setStudentID(studentId);
        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setGender(dto.getGender());
        student.setDob(dto.getDob());
        student.setEmail(dto.getEmail());
        student.setContactNumber(dto.getContactNumber());
        student.setAddress(dto.getAddress());
        student.setApplicationDate(LocalDate.now());
        student.setCourse(course);
        student.setUserLogin(newUser);

        AdmissionStatus status = new AdmissionStatus();
        status.setStudentID(studentId);
        status.setStudentRegistration(student);
        status.setCourse(course);
        status.setStatus("Pending");
        student.setAdmissionStatus(status);

        studentRepo.save(student);

        return new StudentRegisterResponse(studentId, dto.getEmail(), "defaultPass123");
    }

    @Override
    public StudentRegistrationDTO getStudent(String studentID) {
        StudentRegistration student = studentRepo.findById(studentID)
                .orElseThrow(() -> new EntityNotFoundException("Student not found with ID: " + studentID));
        return mapToStudentDTO(student);
    }

    @Override
    public List<StudentRegistrationDTO> getAllStudents() {
        return studentRepo.findAll().stream()
                .map(this::mapToStudentDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StudentRegistrationDTO updateStudent(String studentID, StudentRegistrationDTO dto) {
        StudentRegistration student = studentRepo.findById(studentID)
                .orElseThrow(() -> new EntityNotFoundException("Student not found with ID: " + studentID));
        
        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setEmail(dto.getEmail());
        student.setContactNumber(dto.getContactNumber());
        student.setAddress(dto.getAddress());
        student.setDob(dto.getDob());
        
        studentRepo.save(student);
        return mapToStudentDTO(student);
    }

    private StudentRegistrationDTO mapToStudentDTO(StudentRegistration student) {
        StudentRegistrationDTO dto = new StudentRegistrationDTO();
        dto.setStudentID(student.getStudentID());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setGender(student.getGender());
        dto.setDob(student.getDob());
        dto.setEmail(student.getEmail());
        dto.setContactNumber(student.getContactNumber());
        dto.setAddress(student.getAddress());
        if (student.getCourse() != null) {
            dto.setCourseID(student.getCourse().getCourseID());
        }
        return dto;
    }
}