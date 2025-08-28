package com.cognizant.ams.Controllers;

import com.cognizant.ams.Model.BAO.FeePaymentDTO;
import com.cognizant.ams.Model.BAO.FeeSummaryDTO;
import com.cognizant.ams.Model.DAO.Services.FeesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fees")
public class FeesController {

    @Autowired
    private FeesService service;

    @GetMapping("/{studentID}")
    public FeeSummaryDTO getFeeSummary(@PathVariable String studentID) {
        return service.getFeeSummary(studentID);
    }

    @PostMapping("/pay")
    public FeeSummaryDTO payInstallment(@RequestBody FeePaymentDTO dto) {
        return service.payInstallment(dto);
    }
}