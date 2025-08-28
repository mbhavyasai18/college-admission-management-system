package com.cognizant.ams.Model.BAO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseDTO {
    private String courseID;
    private String courseName;
    private int duration;
    private int totalFees;
}
