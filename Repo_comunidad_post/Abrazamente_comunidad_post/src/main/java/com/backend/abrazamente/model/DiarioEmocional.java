package com.backend.abrazamente.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;

/**
 * Entrada del diario emocional. Mapea la tabla que ya existía en database.sql:
 * pertenece siempre a un usuario y admite una sola entrada por día (uk_usuario_fecha).
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "diario_emocional")
public class DiarioEmocional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /** Nunca se expone ni se acepta desde el cliente: se toma del token. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "fecha_entrada", nullable = false)
    private LocalDate fechaEntrada;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    /** La tabla solo admite 'privado', 'profesional' o 'compartido'. */
    @Column(name = "estado_privacidad", length = 20)
    private String estadoPrivacidad = "privado";

    @CreationTimestamp
    @Column(name = "creado_en", updatable = false)
    private OffsetDateTime creadoEn;

    @UpdateTimestamp
    @Column(name = "actualizado_en")
    private OffsetDateTime actualizadoEn;
}
