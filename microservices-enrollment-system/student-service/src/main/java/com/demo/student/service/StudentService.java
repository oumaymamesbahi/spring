package com.demo.student.service;

import com.demo.student.dto.StudentRequestDTO;
import com.demo.student.dto.StudentResponseDTO;
import com.demo.student.entity.Student;
import com.demo.student.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // Créer un nouvel étudiant
    public StudentResponseDTO createStudent(StudentRequestDTO request) {
        // Valider le CNIE (format simple : 2 lettres + chiffres)
        if (request.getCnie() == null || request.getCnie().trim().isEmpty()) {
            throw new RuntimeException("Le CNIE est obligatoire");
        }
        if (!request.getCnie().matches("^[A-Za-z]{2}\\d{4,}$")) {
            throw new RuntimeException("Le CNIE doit avoir le format: 2 lettres suivies de chiffres (ex: CD2387)");
        }

        // Valider l'email
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("L'email est obligatoire");
        }
        if (!request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new RuntimeException("L'email n'est pas valide");
        }

        // Valider nom et prénom
        if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
            throw new RuntimeException("Le prénom est obligatoire");
        }
        if (request.getLastName() == null || request.getLastName().trim().isEmpty()) {
            throw new RuntimeException("Le nom est obligatoire");
        }

        // Vérifier si le CNIE existe déjà
        if (studentRepository.existsByCnie(request.getCnie())) {
            throw new RuntimeException("Un étudiant avec ce CNIE existe déjà");
        }

        // Vérifier si l'email existe déjà
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Un étudiant avec cet email existe déjà");
        }

        Student student = new Student();
        student.setCnie(request.getCnie());
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setEmail(request.getEmail());

        Student saved = studentRepository.save(student);
        return mapToResponseDTO(saved);
    }

    // Récupérer tous les étudiants
    public List<StudentResponseDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Récupérer un étudiant par ID
    public StudentResponseDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé avec l'ID: " + id));
        return mapToResponseDTO(student);
    }

    // Récupérer un étudiant par CNIE (pour enrollment-service)
    public Student getStudentByCnie(String cnie) {
        return studentRepository.findByCnie(cnie)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé avec le CNIE: " + cnie));
    }

    // Mapper Entity → ResponseDTO
    private StudentResponseDTO mapToResponseDTO(Student student) {
        StudentResponseDTO dto = new StudentResponseDTO();
        dto.setId(student.getId());
        dto.setCnie(student.getCnie());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setEmail(student.getEmail());
        return dto;
    }
}
