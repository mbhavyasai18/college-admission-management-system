package com.cognizant.ams.Controllers;

import com.cognizant.ams.Model.BAO.AdmissionDecisionDTO;
import com.cognizant.ams.Model.BAO.AdmissionStatusDTO;
import com.cognizant.ams.Model.DAO.Services.AdmissionStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admissions")
public class AdmissionStatusController {

    @Autowired
    private AdmissionStatusService service;

    @GetMapping
    public List<AdmissionStatusDTO> getAllAdmissions() {
        return service.getAllRequests();
    }

    @GetMapping("/{studentID}")
    public AdmissionStatusDTO getStatus(@PathVariable String studentID) {
        return service.getStatus(studentID);
    }

    @PostMapping("/process")
    public AdmissionStatusDTO processAdmission(@RequestBody AdmissionDecisionDTO decision) {
        return service.processAdmission(decision);
    }
}