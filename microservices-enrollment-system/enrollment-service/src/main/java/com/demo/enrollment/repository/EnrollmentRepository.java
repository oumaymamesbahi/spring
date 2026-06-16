package com.demo.enrollment.repository;

import com.demo.enrollment.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    
    // Compter le nombre d'étudiants inscrits à un cours
    int countByCourseId(Long courseId);
    
    // Trouver toutes les inscriptions d'un étudiant
    List<Enrollment> findByStudentId(Long studentId);
    
    // Trouver une inscription spécifique (étudiant + cours)
    List<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId);
    
    // Vérifier si un étudiant est déjà inscrit à un cours
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
    
    // Trouver les inscriptions créées après une certaine date (pour la règle des 24h)
    @Query("SELECT e FROM Enrollment e WHERE e.studentId = :studentId AND e.enrollmentDate >= :since")
    List<Enrollment> findRecentEnrollmentsByStudentId(@Param("studentId") Long studentId, @Param("since") LocalDateTime since);
}