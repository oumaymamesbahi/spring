package com.demo.student.controller;

import com.demo.student.dto.StudentInfoDTO;
import com.demo.student.dto.StudentRequestDTO;
import com.demo.student.dto.StudentResponseDTO;
import com.demo.student.entity.Student;
import com.demo.student.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // Récupérer un étudiant par CNIE (route spécifique - DOIT ÊTRE EN PREMIER)
    @GetMapping("/cnie/{cnie}")
    public ResponseEntity<StudentInfoDTO> getStudentByCnie(@PathVariable String cnie) {
        Student student = studentService.getStudentByCnie(cnie);

        StudentInfoDTO dto = new StudentInfoDTO();
        dto.setId(student.getId());
        dto.setCnie(student.getCnie());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setEmail(student.getEmail());

        return ResponseEntity.ok(dto);
    }

    // Créer un nouvel étudiant
    @PostMapping
    public ResponseEntity<StudentResponseDTO> createStudent(@RequestBody StudentRequestDTO request) {
        StudentResponseDTO created = studentService.createStudent(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Récupérer tous les étudiants
    @GetMapping
    public ResponseEntity<List<StudentResponseDTO>> getAllStudents() {
        List<StudentResponseDTO> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    // Récupérer un étudiant par ID
    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> getStudentById(@PathVariable Long id) {
        StudentResponseDTO student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }
}
