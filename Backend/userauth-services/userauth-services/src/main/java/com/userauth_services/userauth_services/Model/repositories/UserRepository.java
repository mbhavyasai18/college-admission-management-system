package com.userauth_services.userauth_services.Model.repositories;

import com.userauth_services.userauth_services.Model.Pojo.OurUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<OurUsers, String> {
    
    Optional<OurUsers> findByUsername(String username);

    // New method to find a user by all three credentials
    Optional<OurUsers> findByUsernameAndPasswordAndRole(String username, String password, String role);
}