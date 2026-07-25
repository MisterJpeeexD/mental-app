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

    private String correo;
    private String password;
    private String nombre;
    private String apellido;
    private String fecha_nacimiento;
    private String genero;
    private String estado_civil;
    private String direccion;
    private String telefono;
    private String bio;
    private String estado;
    private String fecha_creacion;
    private String fecha_modificacion;
    private String ultima_sesion;

    @Enumerated(EnumType.STRING)
    private Rol rol;

}