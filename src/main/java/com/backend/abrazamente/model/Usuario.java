package com.backend.abrazamente.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name="usuarios")

public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_usuario;
    private String nombre;
    private String apellido;
    private String correo;
    private String telefono;
    private String direccion;
    private String password;
    @Enumerated(EnumType.STRING)
    private Rol rol;

}