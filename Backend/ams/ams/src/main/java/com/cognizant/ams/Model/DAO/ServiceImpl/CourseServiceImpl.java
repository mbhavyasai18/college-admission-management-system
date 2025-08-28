package com.cognizant.ams.Model.DAO.ServiceImpl;

import com.cognizant.ams.Model.DAO.Services.CourseService;
import com.cognizant.ams.Model.Exceptions.CourseNotFoundException;
import com.cognizant.ams.Model.Repositories.CourseMasterRepository;
import com.cognizant.ams.Model.POJO.CourseMaster;
import com.cognizant.ams.Model.BAO.CourseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseMasterRepository repository;

    @Override
    public CourseDTO addCourse(CourseDTO dto) {
        CourseMaster course = new CourseMaster();
        course.setCourseID(dto.getCourseID());
        course.setCourseName(dto.getCourseName());
        course.setDuration(dto.getDuration());
        course.setTotalFees(dto.getTotalFees());
        repository.save(course);
        return dto;
    }

    @Override
    public CourseDTO updateCourse(String courseID, CourseDTO dto) {
        CourseMaster course = repository.findById(courseID)
                .orElseThrow(() -> new CourseNotFoundException("Course not found with ID: " + courseID));
        course.setCourseName(dto.getCourseName());
        course.setDuration(dto.getDuration());
        course.setTotalFees(dto.getTotalFees());
        repository.save(course);
        return dto;
    }

    @Override
    public void deleteCourse(String courseID) {
        CourseMaster course = repository.findById(courseID)
                .orElseThrow(() -> new CourseNotFoundException("Course not found with ID: " + courseID));
        repository.delete(course);
    }

    @Override
    public CourseDTO getCourse(String courseID) {
        CourseMaster course = repository.findById(courseID)
                .orElseThrow(() -> new CourseNotFoundException("Course not found with ID: " + courseID));
        return new CourseDTO(course.getCourseID(), course.getCourseName(), course.getDuration(), course.getTotalFees());
    }

    @Override
    public List<CourseDTO> getAllCourses() {
        return repository.findAll().stream()
                .map(c -> new CourseDTO(c.getCourseID(), c.getCourseName(), c.getDuration(), c.getTotalFees()))
                .collect(Collectors.toList());
    }
}