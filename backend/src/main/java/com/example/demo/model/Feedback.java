package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "valoraciones_profesional")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserva_id")
    @JsonIgnore
    private SessionReservation reservation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profesional_id", nullable = false)
    @JsonIgnore
    private Professional professional;

    @Column(name = "puntuacion", precision = 3, scale = 2, nullable = false)
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private BigDecimal rating;

    @Column(name = "comentario", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "aspectos_positivos", columnDefinition = "TEXT")
    private String positiveAspects;

    @Column(name = "aspectos_mejora", columnDefinition = "TEXT")
    private String improvementAspects;

    @Column(name = "recomendaria")
    private boolean recommend = true;

    @Column(name = "fecha_valoracion", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
