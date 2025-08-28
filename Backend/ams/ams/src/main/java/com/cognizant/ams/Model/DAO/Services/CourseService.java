package com.cognizant.ams.Model.DAO.Services;

import com.cognizant.ams.Model.BAO.CourseDTO;
import java.util.List;

public interface CourseService {
    CourseDTO addCourse(CourseDTO courseDTO);
    CourseDTO updateCourse(String courseID, CourseDTO courseDTO);
    void deleteCourse(String courseID);
    CourseDTO getCourse(String courseID);
    List<CourseDTO> getAllCourses();
}
