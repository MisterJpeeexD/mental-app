package com.backend.abrazamente.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "profesionales")
public class Profesional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "licencia_profesional", length = 255)
    private String licenciaProfesional;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "especialidad_principal_id")
    private Especialidad especialidadPrincipal;

    @Column(name = "descripcion_profesional", columnDefinition = "TEXT")
    private String descripcionProfesional;

    @Column(name = "es_voluntario")
    private Boolean esVoluntario = false;

    @Column(name = "tarifa_sesion", precision = 10, scale = 2)
    private BigDecimal tarifaSesion;

    @Column(name = "biografia_profesional", columnDefinition = "TEXT")
    private String biografiaProfesional;

    @Column(name = "anos_experiencia")
    private Integer anosExperiencia;

    @Column(length = 255)
    private String idiomas;

    @Column(length = 20)
    private String estado = "activo";

    @Column(name = "fecha_registro", insertable = false, updatable = false)
    private OffsetDateTime fechaRegistro;

    @Column(name = "fecha_actualizacion", insertable = false, updatable = false)
    private OffsetDateTime fechaActualizacion;

    // Relación Secundaria con Especialidades
    @ManyToMany
    @JoinTable(
            name = "profesional_especialidad",
            joinColumns = @JoinColumn(name = "profesional_id"),
            inverseJoinColumns = @JoinColumn(name = "especialidad_id")
    )
    private Set<Especialidad> especialidadesSecundarias = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Profesional that = (Profesional) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}