package com.demo.enrollment.controller;

import com.demo.enrollment.dto.EnrollmentRequestDTO;
import com.demo.enrollment.dto.EnrollmentResponseDTO;
import com.demo.enrollment.dto.ErrorDTO;
import com.demo.enrollment.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @PostMapping
    public Mono<ResponseEntity<Object>> enrollStudent(@RequestBody EnrollmentRequestDTO request) {
        return enrollmentService.enrollStudent(request)
                .map(response -> new ResponseEntity<Object>(response, HttpStatus.CREATED))
                .onErrorResume(e -> {
                    String errorMessage = e.getMessage() != null ? e.getMessage() : "Erreur lors de l'inscription";
                    return Mono.just(
                        ResponseEntity.badRequest()
                            .header("X-Error", errorMessage)
                            .<Object>body(new ErrorDTO(errorMessage))
                    );
                });
    }

    @GetMapping("/student/{studentCnie}")
    public Mono<ResponseEntity<Object>> getStudentEnrollments(@PathVariable String studentCnie) {
        return enrollmentService.getStudentEnrollments(studentCnie)
                .map(enrollments -> new ResponseEntity<Object>(enrollments, HttpStatus.OK))
                .onErrorResume(e -> {
                    String errorMessage = e.getMessage() != null ? e.getMessage() : "Erreur lors de la récupération des inscriptions";
                    return Mono.just(
                        ResponseEntity.status(404)
                            .header("X-Error", errorMessage)
                            .<Object>body(new ErrorDTO(errorMessage))
                    );
                });
    }

    @DeleteMapping("/{enrollmentId}/student/{studentCnie}")
    public Mono<ResponseEntity<Object>> deleteEnrollment(
            @PathVariable Long enrollmentId,
            @PathVariable String studentCnie) {
        return enrollmentService.deleteEnrollment(enrollmentId, studentCnie)
                .then(Mono.just(ResponseEntity.noContent().<Object>build()))
                .onErrorResume(e -> {
                    String errorMessage = e.getMessage() != null ? e.getMessage() : "Erreur lors de la suppression";
                    return Mono.just(
                        ResponseEntity.badRequest()
                            .header("X-Error", errorMessage)
                            .<Object>body(new ErrorDTO(errorMessage))
                    );
                });
    }
}
