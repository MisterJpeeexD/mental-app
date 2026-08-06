package com.backend.abrazamente.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "sesiones_terapia")
public class SesionTerapia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profesional_id", nullable = false)
    private Profesional profesional;

    @Column(name = "fecha_hora", nullable = false)
    private OffsetDateTime fechaHora;

    @Column(name = "estado", length = 20, nullable = false)
    private String estado = "PENDIENTE"; // PENDIENTE, COMPLETADA, CANCELADA

    @Column(name = "teams_meeting_url", length = 500)
    private String teamsMeetingUrl;

    @Column(name = "notas", columnDefinition = "TEXT")
    private String notas;

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    private OffsetDateTime fechaCreacion;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SesionTerapia that = (SesionTerapia) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
