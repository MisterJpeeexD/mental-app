package com.backend.abrazamente.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UsuarioRequestDTO(
        @NotBlank(message = "Es obligatorio entregar el nombre")
        String nombre,
        @NotNull(message = "Es obligatorio entregar el apellido")
        String apellido,
        @Email(message = "Formato incorrecto")
        String correo,
        @Size(min = 3, max = 10, message = "El teléfono debe tener entre 3 y 10 dígitos")
        String telefono,
        @NotBlank(message = "Es obligatorio entregar la dirección")
        String direccion
) {
}
