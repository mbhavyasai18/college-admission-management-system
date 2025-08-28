package com.cognizant.ams.Controllers;

import com.cognizant.ams.Model.BAO.UserLoginResponse;
import com.cognizant.ams.Model.DAO.Services.UserLoginService;
import com.cognizant.ams.Model.BAO.LoginRequestDto; // Import the DTO
import com.cognizant.ams.Model.POJO.UserLogin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
public class UserLoginController {

    @Autowired
    private UserLoginService userLoginService;

    @PostMapping
    public UserLoginResponse login(@RequestBody LoginRequestDto loginRequest) {
        UserLogin user = userLoginService.login(loginRequest.getUsername(), loginRequest.getPassword());
        return new UserLoginResponse(user.getUserID(), user.getUsername(), user.getRole());
    }

    @GetMapping("/{userID}")
    public UserLoginResponse getUser(@PathVariable String userID) {
        UserLogin user = userLoginService.findByUserID(userID);
        return new UserLoginResponse(user.getUserID(), user.getUsername(), user.getRole());
    }
}