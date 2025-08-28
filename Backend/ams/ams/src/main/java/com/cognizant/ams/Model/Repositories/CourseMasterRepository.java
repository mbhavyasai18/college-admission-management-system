package com.cognizant.ams.Model.Repositories;

import com.cognizant.ams.Model.POJO.CourseMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseMasterRepository extends JpaRepository<CourseMaster, String> {
}