package com.cognizant.ams.Controllers;

import com.cognizant.ams.Model.BAO.CourseDTO;
import com.cognizant.ams.Model.DAO.Services.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService service;

    @PostMapping
    public CourseDTO addCourse(@RequestBody CourseDTO dto) {
        return service.addCourse(dto);
    }

    @PutMapping("/{courseID}")
    public CourseDTO updateCourse(@PathVariable String courseID, @RequestBody CourseDTO dto) {
        return service.updateCourse(courseID, dto);
    }

    @DeleteMapping("/{courseID}")
    public String deleteCourse(@PathVariable String courseID) {
        service.deleteCourse(courseID);
        return "Course deleted successfully.";
    }

    @GetMapping("/{courseID}")
    public CourseDTO getCourse(@PathVariable String courseID) {
        return service.getCourse(courseID);
    }

    @GetMapping
    public List<CourseDTO> getAllCourses() {
        return service.getAllCourses();
    }
}