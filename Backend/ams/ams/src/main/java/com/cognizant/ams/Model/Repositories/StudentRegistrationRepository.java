package com.cognizant.ams.Model.Repositories;

import com.cognizant.ams.Model.POJO.StudentRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRegistrationRepository extends JpaRepository<StudentRegistration, String> {
}