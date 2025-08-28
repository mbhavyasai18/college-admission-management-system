package com.cognizant.ams.Model.Repositories;

import com.cognizant.ams.Model.POJO.AdmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdmissionStatusRepository extends JpaRepository<AdmissionStatus, String> {
}