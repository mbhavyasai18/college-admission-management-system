package com.cognizant.ams.Model.POJO;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "tblFees_Details")
@Data
public class FeesDetails {

    @Id
    @Column(name = "FeeID", nullable = false, length = 10)
    private String feeID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "StudentID", nullable = false)
    private StudentRegistration studentRegistration;

    @Column(name = "PaidAmount", nullable = false)
    private int paidAmount;

    @Column(name = "PaymentDate", nullable = false)
    private LocalDate paymentDate;
    
    @Column(name = "remaining_fee")
    private int remainingFee;

    @Column(name = "InstallmentNo", nullable = false)
    private int installmentNo;
}