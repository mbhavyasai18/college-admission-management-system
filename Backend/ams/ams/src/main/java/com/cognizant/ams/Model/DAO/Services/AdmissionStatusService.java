package com.cognizant.ams.Model.DAO.Services;

import com.cognizant.ams.Model.BAO.AdmissionDecisionDTO;
import com.cognizant.ams.Model.BAO.AdmissionStatusDTO;

import java.util.List;

public interface AdmissionStatusService {
    List<AdmissionStatusDTO> getAllRequests();
    AdmissionStatusDTO getStatus(String studentID);
    AdmissionStatusDTO processAdmission(AdmissionDecisionDTO decision);
}
