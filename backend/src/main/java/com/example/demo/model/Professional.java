package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Table(name = "professionals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Professional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Role is required")
    private String role; // e.g., "PSYCHOLOGIST", "COACH", "VOLUNTEER"

    @NotBlank(message = "Specialty is required")
    private String specialty; // e.g., "MENTAL_HEALTH", "PROFESSIONAL_DEVELOPMENT", "ALTERNATIVE_HOLISTIC"

    private boolean firstSessionFree = false;

    private double rating = 5.0;

    @OneToMany(mappedBy = "professional", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Feedback> feedbacks;
}
