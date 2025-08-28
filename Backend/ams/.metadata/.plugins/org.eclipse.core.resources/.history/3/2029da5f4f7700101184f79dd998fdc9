package com.cognizant.ams.Model.POJO;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "tbl_user_login")
@Data
public class UserLogin {

    @Id
    @Column(name = "user_id") // This is the single, primary key column
    private String userID;

    @Column(name = "Username")
    private String username;

    @Column(name = "Password")
    private String password;

    @Column(name = "Role")
    private String role;
}