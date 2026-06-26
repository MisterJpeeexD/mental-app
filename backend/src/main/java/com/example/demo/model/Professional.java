package com.example.demo.model;

import com.example.demo.model.enums.ProfessionalStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "profesionales")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Professional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", unique  = true, nullable = false)
    private User user;

    @NotBlank(message   = "Licencia pro esional is required")
    @Column(name = "licencia_profesional", nullable = false)
    private String licenciaProfesional;

    @Column(name    = "especialidad_principal_id")
    private Long especialidadPrincipalId;

    @Column(name = "descripcion_profesional", columnDefinition = "TEXT")
    private String descripcionProfesional;

    @Column(name = "foto_profesional_url", length = 500)
    private String fotoProfesionalUrl;

    @Column(name = "es_voluntario", nullable = false)
    private boolean esVoluntario = false;

    @Column(name = "tarifa_sesion", precision = 10, scale = 2)
    private BigDecimal tarifaSesion;

    @Column(name = "biografia_profesional", columnDefinition = "TEXT")
    private String biografiaProfesional;

    @Column(name = "anos_experiencia")
    private Integer anosExperiencia;

    private String idiomas;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProfessionalStatus estado = ProfessionalStatus.activo;

    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    @Column(name = "fecha_actualizacion", nullable = false)
    private LocalDateTime fechaActualizacion = LocalDateTime.now();

    @OneToMany(mappedBy = "professional", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SessionReservation> reservations;

    @OneToMany(mappedBy = "professional", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Feedback> ratings;
}
        