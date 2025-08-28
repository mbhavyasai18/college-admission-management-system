package com.cognizant.ams.Model.DAO.ServiceImpl;

import com.cognizant.ams.Model.DAO.Services.UserLoginService;
import com.cognizant.ams.Model.POJO.UserLogin;
import com.cognizant.ams.Model.Repositories.UserLoginRepository;
import com.cognizant.ams.Model.Exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserLoginServiceImpl implements UserLoginService {

    @Autowired
    private UserLoginRepository userLoginRepository;

    @Override
    public UserLogin login(String username, String password) {
        return userLoginRepository.findAll().stream()
                .filter(user -> user.getUsername().equals(username) && user.getPassword().equals(password))
                .findFirst()
                .orElseThrow(() -> new UserNotFoundException("Invalid username or password"));
    }

    @Override
    public UserLogin findByUserID(String userID) {
        return userLoginRepository.findById(userID)
                .orElseThrow(() -> new UserNotFoundException("User ID not found: " + userID));
    }
}