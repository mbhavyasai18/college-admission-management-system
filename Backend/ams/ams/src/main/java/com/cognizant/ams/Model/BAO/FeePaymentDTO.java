package com.cognizant.ams.Model.BAO;

import lombok.Data;
import java.time.LocalDate;

@Data
public class FeePaymentDTO {
    private String studentID;
    private int paidAmount;
    private int installmentNo;
    private LocalDate paymentDate;
}
