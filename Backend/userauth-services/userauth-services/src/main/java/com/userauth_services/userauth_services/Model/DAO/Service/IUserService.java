package com.userauth_services.userauth_services.Model.DAO.Service;

import org.springframework.security.core.userdetails.UserDetailsService;

public interface IUserService {
    UserDetailsService userDetailsService();
    // The login method has been removed from this interface.
}