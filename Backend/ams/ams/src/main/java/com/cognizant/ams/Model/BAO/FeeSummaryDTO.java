package com.cognizant.ams.Model.BAO;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class FeeSummaryDTO {
    private String studentID;
    private int totalPaid;
    private int totalDue;
    private List<FeeInstallmentDTO> installments;
}
