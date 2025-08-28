package com.cognizant.ams.Model.POJO;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "tbl_student_registration")
@Data
public class StudentRegistration {

    @Id
    @Column(name = "studentid", nullable = false)
    private String studentID;

    // This creates the relationship to the UserLogin table.
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private UserLogin userLogin;

    private String firstName;
    private String lastName;
    private String gender;
    private LocalDate dob;
    private String email;
    private String contactNumber;
    private String address;

    @ManyToOne
    @JoinColumn(name = "courseid", nullable = false)
    private CourseMaster course;

    private LocalDate applicationDate;

    @OneToOne(mappedBy = "studentRegistration", cascade = CascadeType.ALL)
    private AdmissionStatus admissionStatus;

    // Relationships to other tables (optional but good practice)
    @OneToMany(mappedBy = "studentRegistration", cascade = CascadeType.ALL)
    private List<FeesDetails> fees;

    @OneToMany(mappedBy = "studentRegistration", cascade = CascadeType.ALL)
    private List<StudentDocuments> documents;
}