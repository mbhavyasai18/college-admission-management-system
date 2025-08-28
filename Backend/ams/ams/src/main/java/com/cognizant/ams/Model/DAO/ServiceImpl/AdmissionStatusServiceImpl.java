package com.cognizant.ams.Model.DAO.ServiceImpl;

import com.cognizant.ams.Model.BAO.AdmissionDecisionDTO;
import com.cognizant.ams.Model.BAO.AdmissionStatusDTO;
import com.cognizant.ams.Model.DAO.Services.AdmissionStatusService;
import com.cognizant.ams.Model.Exceptions.AdmissionNotFoundException;
import com.cognizant.ams.Model.POJO.AdmissionStatus;
import com.cognizant.ams.Model.POJO.StudentRegistration;
import com.cognizant.ams.Model.Repositories.AdmissionStatusRepository;
import com.cognizant.ams.Model.Repositories.StudentRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdmissionStatusServiceImpl implements AdmissionStatusService {

    @Autowired
    private AdmissionStatusRepository admissionRepo;

    @Autowired
    private StudentRegistrationRepository studentRepo;

    @Override
    public List<AdmissionStatusDTO> getAllRequests() {
        return admissionRepo.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AdmissionStatusDTO getStatus(String studentID) {
        AdmissionStatus status = admissionRepo.findById(studentID)
                .orElseThrow(() -> new AdmissionNotFoundException("Admission not found for Student ID: " + studentID));
        return toDTO(status);
    }

    @Override
    public AdmissionStatusDTO processAdmission(AdmissionDecisionDTO decision) {
        StudentRegistration student = studentRepo.findById(decision.getStudentID())
                .orElseThrow(() -> new AdmissionNotFoundException("Student not found"));

        AdmissionStatus status;
        Optional<AdmissionStatus> existing = admissionRepo.findById(decision.getStudentID());
        if (existing.isPresent()) {
            status = existing.get();
        } else {
            status = new AdmissionStatus();
            status.setStudentID(student.getStudentID());
        }

        status.setCourse(student.getCourse());
        status.setStatus(decision.getStatus());
        status.setConcession(decision.getConcession());
        status.setApprovedDate(LocalDate.now());

        admissionRepo.saveAndFlush(status);
        return toDTO(status);
    }

    private AdmissionStatusDTO toDTO(AdmissionStatus status) {
        AdmissionStatusDTO dto = new AdmissionStatusDTO();
        dto.setStudentID(status.getStudentID());
        
        // This check prevents an error if the course is somehow null
        if (status.getCourse() != null) {
            dto.setCourseID(status.getCourse().getCourseID());
        } else {
            dto.setCourseID("N/A");
        }
        
        dto.setStatus(status.getStatus());
        dto.setConcession(status.getConcession());
        dto.setApprovedDate(status.getApprovedDate());
        return dto;
    }
}