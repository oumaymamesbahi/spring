package com.demo.course.dto;

public class CourseRequestDTO {
    private String title;
    private String description;
    private int credits;

    public CourseRequestDTO() {}

    public CourseRequestDTO(String title, String description, int credits) {
        this.title = title;
        this.description = description;
        this.credits = credits;
    }

    // Getters
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public int getCredits() { return credits; }

    // Setters
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setCredits(int credits) { this.credits = credits; }
}