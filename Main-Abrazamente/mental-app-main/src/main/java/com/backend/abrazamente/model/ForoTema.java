package com.backend.abrazamente.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.Objects;

@Getter
@Setter
@AllArgsConstructor
@Entity
@Table(name = "foro_temas")
public class ForoTema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forum_id", nullable = false)
    private ForoTematico foro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 255)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String contenido;

    @Column(name = "numero_respuestas")
    private Integer numeroRespuestas = 0;

    private Integer vistas = 0;

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_ultima_actividad", insertable = false, updatable = false)
    private OffsetDateTime fechaUltimaActividad;

    public ForoTema() {
    }

    // Getters y Setters
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ForoTema foroTema = (ForoTema) o;
        return Objects.equals(id, foroTema.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}