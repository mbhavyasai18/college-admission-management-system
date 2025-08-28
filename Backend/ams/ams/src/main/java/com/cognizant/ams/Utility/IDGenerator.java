package com.cognizant.ams.Utility;

import java.util.UUID;

public class IDGenerator {

    public static String generateStudentID() {
        return "S" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public static String generateUserID() {
        return "U" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public static String generateFeeID() {
        return "FEE" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    public static String generateDocumentID() {
        return "DOC" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}