package com.cognizant.ams.Model.DAO.Services;

import com.cognizant.ams.Model.POJO.UserLogin;

public interface UserLoginService {
    UserLogin login(String username, String password);
    UserLogin findByUserID(String userID);
}
