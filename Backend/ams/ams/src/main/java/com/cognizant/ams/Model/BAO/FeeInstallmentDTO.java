package com.cognizant.ams.Model.BAO;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class FeeInstallmentDTO {
    private String feeID;
    private int installmentNo;
    private int paidAmount;
    private LocalDate paymentDate;
}
