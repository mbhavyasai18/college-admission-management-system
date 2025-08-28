package com.cognizant.ams.Model.DAO.Services;

import com.cognizant.ams.Model.BAO.FeePaymentDTO;
import com.cognizant.ams.Model.BAO.FeeSummaryDTO;

public interface FeesService {
    FeeSummaryDTO getFeeSummary(String studentID);
    FeeSummaryDTO payInstallment(FeePaymentDTO dto);
}