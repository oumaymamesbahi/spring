package com.demo.student.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.demo.student.entity.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    // Trouver un étudiant par son CNIE (unique)
    Optional<Student> findByCnie(String cnie);
    
    // Vérifier si un CNIE existe déjà
    boolean existsByCnie(String cnie);
    
    // Vérifier si un email existe déjà
    boolean existsByEmail(String email);
}