package com.backend.abrazamente.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioRequestDTO(
        @NotBlank(message = "Es obligatorio entregar el nombre")
        String nombres,

        @NotBlank(message = "Es obligatorio entregar el apellido")
        String apellidos,

        @NotBlank(message = "Es obligatorio entregar el email")
        @Email(message = "Formato de email incorrecto")
        String email,

        @NotBlank(message = "Es obligatoria la contraseña")
        @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
        String password,

        @Size(min = 8, max = 20, message = "El teléfono debe tener entre 8 y 20 dígitos")
        String telefono,

        @NotBlank(message = "Es obligatorio entregar la ciudad")
        String ciudad
) {
}