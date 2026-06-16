package com.demo.course.repository;

import com.demo.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    // Vérifier si un cours existe par son ID
    boolean existsById(Long id);

    // Vérifier si un cours existe par son titre
    boolean existsByTitle(String title);
}
