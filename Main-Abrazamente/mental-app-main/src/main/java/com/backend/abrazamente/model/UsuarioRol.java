package com.backend.abrazamente.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "usuario_roles")
@Getter
@Setter
@NoArgsConstructor
public class UsuarioRol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "rol_id")
    private Rol rol;

    // Opción para evitar mantener la celda en null en el apartado de fecha asignacion
    @PrePersist
    public void prePersist() {
        this.fechaAsignacion = OffsetDateTime.now();
    }

    private OffsetDateTime fechaAsignacion;
}
