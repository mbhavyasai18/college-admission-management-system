package com.cognizant.ams.Model.POJO;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "tblCourse_Master")
@Data
public class CourseMaster {

    @Id
    @Column(name = "CourseID", nullable = false, length = 10)
    private String courseID;

    @Column(name = "CourseName", nullable = false, length = 50)
    private String courseName;

    @Column(name = "Duration", nullable = false)
    private int duration;

    @Column(name = "TotalFees", nullable = false)
    private int totalFees;
}