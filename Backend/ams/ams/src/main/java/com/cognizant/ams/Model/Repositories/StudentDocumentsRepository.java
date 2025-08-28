package com.cognizant.ams.Model.Repositories;

import com.cognizant.ams.Model.POJO.StudentDocuments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentDocumentsRepository extends JpaRepository<StudentDocuments, String> {

    // CHANGED: The method now searches through the StudentRegistration object to find its studentID.
    List<StudentDocuments> findByStudentRegistration_StudentID(String studentID);
}