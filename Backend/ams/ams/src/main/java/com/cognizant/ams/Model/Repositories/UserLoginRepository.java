package com.cognizant.ams.Model.Repositories;

import com.cognizant.ams.Model.POJO.UserLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserLoginRepository extends JpaRepository<UserLogin, String> {
}