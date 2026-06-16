package com.demo.course.controller;

import com.demo.course.dto.CourseInfoDTO;
import com.demo.course.dto.CourseRequestDTO;
import com.demo.course.dto.CourseResponseDTO;
import com.demo.course.entity.Course;
import com.demo.course.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    // Créer un nouveau cours
    @PostMapping
    public ResponseEntity<CourseResponseDTO> createCourse(@RequestBody CourseRequestDTO request) {
        CourseResponseDTO created = courseService.createCourse(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Récupérer tous les cours
    @GetMapping
    public ResponseEntity<List<CourseResponseDTO>> getAllCourses() {
        List<CourseResponseDTO> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    // Récupérer un cours par ID (utilisé par enrollment-service)
    @GetMapping("/{id}")
    public ResponseEntity<CourseInfoDTO> getCourseById(@PathVariable Long id) {
        Course course = courseService.getCourseByIdRaw(id); 
        
        CourseInfoDTO dto = new CourseInfoDTO();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setCredits(course.getCredits());
        
        return ResponseEntity.ok(dto);
    }
    @GetMapping("/test")
    public String test() {
        return "Course service is working!";
    }
}