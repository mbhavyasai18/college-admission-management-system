package com.cognizant.ams.Model.Repositories;

import com.cognizant.ams.Model.POJO.FeesDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeesDetailsRepository extends JpaRepository<FeesDetails, String> {

    // CHANGED: The method now searches through the StudentRegistration object to find its studentID.
    List<FeesDetails> findByStudentRegistration_StudentID(String studentID);
}