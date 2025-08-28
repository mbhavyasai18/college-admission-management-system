package com.cognizant.ams;

import com.cognizant.ams.Controllers.CourseController;
import com.cognizant.ams.Model.BAO.CourseDTO;
import com.cognizant.ams.Model.DAO.Services.CourseService;
import com.cognizant.ams.Model.DAO.ServiceImpl.CourseServiceImpl;
import com.cognizant.ams.Model.DAO.ServiceImpl.UserLoginServiceImpl;
import com.cognizant.ams.Model.Exceptions.CourseNotFoundException;
import com.cognizant.ams.Model.Exceptions.UserNotFoundException;
import com.cognizant.ams.Model.POJO.CourseMaster;
import com.cognizant.ams.Model.POJO.UserLogin;
import com.cognizant.ams.Model.Repositories.CourseMasterRepository;
import com.cognizant.ams.Model.Repositories.UserLoginRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
class AmsApplicationTests {

	@Test
	void contextLoads() {
	}

}

class CourseServiceImplTest {

    @Mock
    private CourseMasterRepository repository;

    @InjectMocks
    private CourseServiceImpl service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddCourse() {
        CourseDTO courseDTO = new CourseDTO("CS101", "Introduction to Computer Science", 4, 5000);
        when(repository.save(any(CourseMaster.class))).thenReturn(new CourseMaster());
        CourseDTO result = service.addCourse(courseDTO);
        assertNotNull(result);
        assertEquals("CS101", result.getCourseID());
    }

    @Test
    void testUpdateCourse() {
        CourseDTO courseDTO = new CourseDTO("CS101", "Advanced Computer Science", 4, 5500);
        CourseMaster existingCourse = new CourseMaster();
        existingCourse.setCourseID("CS101");
        when(repository.findById("CS101")).thenReturn(Optional.of(existingCourse));
        when(repository.save(any(CourseMaster.class))).thenReturn(existingCourse);
        CourseDTO result = service.updateCourse("CS101", courseDTO);
        assertNotNull(result);
        assertEquals("Advanced Computer Science", result.getCourseName());
    }

    @Test
    void testUpdateCourseNotFound() {
        CourseDTO courseDTO = new CourseDTO("CS101", "Advanced Computer Science", 4, 5500);
        when(repository.findById("CS101")).thenReturn(Optional.empty());
        assertThrows(CourseNotFoundException.class, () -> service.updateCourse("CS101", courseDTO));
    }

    @Test
    void testDeleteCourse() {
        CourseMaster existingCourse = new CourseMaster();
        existingCourse.setCourseID("CS101");
        when(repository.findById("CS101")).thenReturn(Optional.of(existingCourse));
        doNothing().when(repository).delete(existingCourse);
        service.deleteCourse("CS101");
        verify(repository, times(1)).delete(existingCourse);
    }

    @Test
    void testDeleteCourseNotFound() {
        when(repository.findById("CS101")).thenReturn(Optional.empty());
        assertThrows(CourseNotFoundException.class, () -> service.deleteCourse("CS101"));
    }

    @Test
    void testGetCourse() {
        CourseMaster course = new CourseMaster();
        course.setCourseID("CS101");
        course.setCourseName("Introduction to Computer Science");
        course.setDuration(4);
        course.setTotalFees(5000);
        when(repository.findById("CS101")).thenReturn(Optional.of(course));
        CourseDTO result = service.getCourse("CS101");
        assertNotNull(result);
        assertEquals("Introduction to Computer Science", result.getCourseName());
    }

    @Test
    void testGetCourseNotFound() {
        when(repository.findById("CS101")).thenReturn(Optional.empty());
        assertThrows(CourseNotFoundException.class, () -> service.getCourse("CS101"));
    }

    @Test
    void testGetAllCourses() {
        CourseMaster course = new CourseMaster();
        course.setCourseID("CS101");
        when(repository.findAll()).thenReturn(Collections.singletonList(course));
        assertEquals(1, service.getAllCourses().size());
    }
}

class UserLoginServiceImplTest {

    @Mock
    private UserLoginRepository userLoginRepository;

    @InjectMocks
    private UserLoginServiceImpl userLoginService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLoginSuccess() {
        UserLogin user = new UserLogin();
        user.setUsername("testuser");
        user.setPassword("password");
        when(userLoginRepository.findAll()).thenReturn(Collections.singletonList(user));
        UserLogin result = userLoginService.login("testuser", "password");
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
    }

    @Test
    void testLoginFailure() {
        when(userLoginRepository.findAll()).thenReturn(Collections.emptyList());
        assertThrows(UserNotFoundException.class, () -> userLoginService.login("testuser", "password"));
    }

    @Test
    void testFindByUserIDSuccess() {
        UserLogin user = new UserLogin();
        user.setUserID("123");
        when(userLoginRepository.findById("123")).thenReturn(Optional.of(user));
        UserLogin result = userLoginService.findByUserID("123");
        assertNotNull(result);
        assertEquals("123", result.getUserID());
    }

    @Test
    void testFindByUserIDFailure() {
        when(userLoginRepository.findById("123")).thenReturn(Optional.empty());
        assertThrows(UserNotFoundException.class, () -> userLoginService.findByUserID("123"));
    }
}

@WebMvcTest(CourseController.class)
class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CourseService courseService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testAddCourse() throws Exception {
        CourseDTO courseDTO = new CourseDTO("CS101", "Computer Science", 4, 5000);
        when(courseService.addCourse(courseDTO)).thenReturn(courseDTO);

        mockMvc.perform(post("/api/courses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(courseDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.courseID").value("CS101"));
    }
}