package com.demo.course.service;

import com.demo.course.dto.CourseRequestDTO;
import com.demo.course.dto.CourseResponseDTO;
import com.demo.course.entity.Course;
import com.demo.course.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    // Créer un nouveau cours
    public CourseResponseDTO createCourse(CourseRequestDTO request) {
        // Valider les champs obligatoires
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Le titre du cours est obligatoire");
        }
        if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            throw new RuntimeException("La description du cours est obligatoire");
        }
        if (request.getCredits() <= 0) {
            throw new RuntimeException("Les crédits doivent être un nombre positif");
        }

        // Vérifier si un cours avec le même titre existe déjà
        if (courseRepository.existsByTitle(request.getTitle())) {
            throw new RuntimeException("Un cours avec ce titre existe déjà");
        }

        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setCredits(request.getCredits());

        Course saved = courseRepository.save(course);
        return mapToResponseDTO(saved);
    }

    // Récupérer tous les cours
    public List<CourseResponseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Récupérer un cours par ID (retourne le DTO)
    public CourseResponseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé avec l'ID: " + id));
        return mapToResponseDTO(course);
    }

    // Récupérer un cours par ID (retourne l'entité pour enrollment-service)
    public Course getCourseByIdRaw(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé avec l'ID: " + id));
    }

    // Vérifier si un cours existe
    public boolean courseExists(Long id) {
        return courseRepository.existsById(id);
    }

    // Mapper Entity → ResponseDTO
    private CourseResponseDTO mapToResponseDTO(Course course) {
        CourseResponseDTO dto = new CourseResponseDTO();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setCredits(course.getCredits());
        return dto;
    }
}
