package com.userauth_services.userauth_services.exceptions;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException; // Corrected import
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalException {

    /**
     * Handles exceptions when a user tries to access a resource they are not
     * authorized to.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> handleAccessDenied() {
        return new ResponseEntity<>("Access Denied: You do not have permission to access this resource.", HttpStatus.FORBIDDEN);
    }

    /**
     * Handles exceptions when the JWT signature is invalid.
     */
    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<String> handleSignatureDenied() {
        return new ResponseEntity<>("Invalid Token Signature", HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handles exceptions for malformed JWTs.
     */
    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<String> handleMalformedJwt() {
        return new ResponseEntity<>("Malformed Token", HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handles exceptions for expired JWTs.
     */
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<String> handleExpiredJwt() {
        return new ResponseEntity<>("Token has expired", HttpStatus.UNAUTHORIZED);
    }

}