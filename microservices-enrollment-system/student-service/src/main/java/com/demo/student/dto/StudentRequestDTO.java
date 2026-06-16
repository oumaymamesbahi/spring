package com.demo.student.dto;

public class StudentRequestDTO {
    private String cnie;
    private String firstName;
    private String lastName;
    private String email;

    public StudentRequestDTO() {}

    public StudentRequestDTO(String cnie, String firstName, String lastName, String email) {
        this.cnie = cnie;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    // Getters
    public String getCnie() { return cnie; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }

    // Setters
    public void setCnie(String cnie) { this.cnie = cnie; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setEmail(String email) { this.email = email; }
}