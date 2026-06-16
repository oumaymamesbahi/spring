package com.demo.enrollment.dto;

public class EnrollmentRequestDTO {
    private String studentCnie;
    private Long courseId;

    public EnrollmentRequestDTO() {}

    public EnrollmentRequestDTO(String studentCnie, Long courseId) {
        this.studentCnie = studentCnie;
        this.courseId = courseId;
    }

    // Getters
    public String getStudentCnie() { return studentCnie; }
    public Long getCourseId() { return courseId; }

    // Setters
    public void setStudentCnie(String studentCnie) { this.studentCnie = studentCnie; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
}