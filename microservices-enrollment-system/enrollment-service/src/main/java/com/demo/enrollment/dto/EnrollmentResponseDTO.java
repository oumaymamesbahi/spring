package com.demo.enrollment.dto;

public class EnrollmentResponseDTO {
    private Long enrollmentId;
    private String studentCnie;
    private String studentName;
    private String courseName;
    private String enrollmentDate;
    private boolean deletable;

    public EnrollmentResponseDTO() {}

    public EnrollmentResponseDTO(Long enrollmentId, String studentCnie, String studentName, 
                                  String courseName, String enrollmentDate, boolean deletable) {
        this.enrollmentId = enrollmentId;
        this.studentCnie = studentCnie;
        this.studentName = studentName;
        this.courseName = courseName;
        this.enrollmentDate = enrollmentDate;
        this.deletable = deletable;
    }

    // Getters
    public Long getEnrollmentId() { return enrollmentId; }
    public String getStudentCnie() { return studentCnie; }
    public String getStudentName() { return studentName; }
    public String getCourseName() { return courseName; }
    public String getEnrollmentDate() { return enrollmentDate; }
    public boolean isDeletable() { return deletable; }

    // Setters
    public void setEnrollmentId(Long enrollmentId) { this.enrollmentId = enrollmentId; }
    public void setStudentCnie(String studentCnie) { this.studentCnie = studentCnie; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
    public void setEnrollmentDate(String enrollmentDate) { this.enrollmentDate = enrollmentDate; }
    public void setDeletable(boolean deletable) { this.deletable = deletable; }
}