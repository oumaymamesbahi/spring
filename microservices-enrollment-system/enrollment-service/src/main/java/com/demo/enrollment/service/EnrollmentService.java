package com.demo.enrollment.service;

import com.demo.enrollment.clients.CourseClient;
import com.demo.enrollment.clients.StudentClient;
import com.demo.enrollment.dto.CourseInfoDTO;
import com.demo.enrollment.dto.EnrollmentRequestDTO;
import com.demo.enrollment.dto.EnrollmentResponseDTO;
import com.demo.enrollment.dto.StudentInfoDTO;
import com.demo.enrollment.entity.Enrollment;
import com.demo.enrollment.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private StudentClient studentClient;

    @Autowired
    private CourseClient courseClient;

    private static final int MAX_STUDENTS_PER_COURSE = 3;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    // Créer une nouvelle inscription
    public Mono<EnrollmentResponseDTO> enrollStudent(EnrollmentRequestDTO request) {
        
        return studentClient.getStudentByCnie(request.getStudentCnie())
                .zipWith(courseClient.getCourseById(request.getCourseId()))
                .flatMap(tuple -> {
                    StudentInfoDTO student = tuple.getT1();
                    CourseInfoDTO course = tuple.getT2();

                    return Mono.fromCallable(() -> 
                                enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), request.getCourseId()))
                            .subscribeOn(Schedulers.boundedElastic())
                            .flatMap(exists -> {
                                if (exists) {
                                    return Mono.error(new RuntimeException("L'étudiant est déjà inscrit à ce cours"));
                                }

                                return Mono.fromCallable(() -> 
                                            enrollmentRepository.countByCourseId(request.getCourseId()))
                                        .subscribeOn(Schedulers.boundedElastic())
                                        .flatMap(count -> {
                                            if (count >= MAX_STUDENTS_PER_COURSE) {
                                                return Mono.error(new RuntimeException("Ce cours a déjà atteint le nombre maximum d'étudiants (3)"));
                                            }

                                            Enrollment enrollment = new Enrollment();
                                            enrollment.setStudentId(student.getId());
                                            enrollment.setCourseId(request.getCourseId());
                                            enrollment.setEnrollmentDate(LocalDateTime.now());

                                            return Mono.fromCallable(() -> enrollmentRepository.save(enrollment))
                                                    .subscribeOn(Schedulers.boundedElastic())
                                                    .map(saved -> buildResponseDTO(saved, student, course));
                                        });
                            });
                });
    }

    // Récupérer toutes les inscriptions d'un étudiant (Dashboard)
    public Mono<List<EnrollmentResponseDTO>> getStudentEnrollments(String studentCnie) {

        return studentClient.getStudentByCnie(studentCnie)
                .flatMap(student ->
                    Mono.fromCallable(() -> enrollmentRepository.findByStudentId(student.getId()))
                        .subscribeOn(Schedulers.boundedElastic())
                        .flatMap(enrollments -> {
                            if (enrollments.isEmpty()) {
                                return Mono.just(java.util.Collections.emptyList());
                            }

                            List<Mono<EnrollmentResponseDTO>> list = enrollments.stream()
                                    .map(enrollment -> courseClient.getCourseById(enrollment.getCourseId())
                                            .map(course -> buildResponseDTO(enrollment, student, course)))
                                    .collect(Collectors.toList());

                            return Mono.zip(list, results ->
                                java.util.Arrays.stream(results)
                                    .map(EnrollmentResponseDTO.class::cast)
                                    .collect(Collectors.toList())
                            );
                        })
                );
    }

    // Supprimer une inscription (avec règle des 24h)
    public Mono<Void> deleteEnrollment(Long enrollmentId, String studentCnie) {
        
        return studentClient.getStudentByCnie(studentCnie)
                .flatMap(student -> 
                    Mono.fromCallable(() -> enrollmentRepository.findById(enrollmentId)
                                .orElseThrow(() -> new RuntimeException("Inscription non trouvée avec l'ID: " + enrollmentId)))
                            .subscribeOn(Schedulers.boundedElastic())
                            .flatMap(enrollment -> {
                                if (!enrollment.getStudentId().equals(student.getId())) {
                                    return Mono.error(new RuntimeException("Cette inscription n'appartient pas à l'étudiant"));
                                }

                                LocalDateTime now = LocalDateTime.now();
                                LocalDateTime twentyFourHoursAgo = now.minusHours(24);
                                
                                if (enrollment.getEnrollmentDate().isBefore(twentyFourHoursAgo)) {
                                    return Mono.error(new RuntimeException("Impossible de supprimer : l'inscription date de plus de 24 heures"));
                                }

                                return Mono.fromRunnable(() -> enrollmentRepository.deleteById(enrollmentId))
                                        .subscribeOn(Schedulers.boundedElastic())
                                        .then();
                            })
                );
    }

    // Construire le DTO de réponse
    private EnrollmentResponseDTO buildResponseDTO(Enrollment enrollment, StudentInfoDTO student, CourseInfoDTO course) {
        EnrollmentResponseDTO dto = new EnrollmentResponseDTO();
        dto.setEnrollmentId(enrollment.getId());
        dto.setStudentCnie(student.getCnie());
        dto.setStudentName(student.getFirstName() + " " + student.getLastName());
        dto.setCourseName(course.getTitle());
        dto.setEnrollmentDate(enrollment.getEnrollmentDate().format(FORMATTER));
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime twentyFourHoursAgo = now.minusHours(24);
        dto.setDeletable(enrollment.getEnrollmentDate().isAfter(twentyFourHoursAgo));
        
        return dto;
    }
}
